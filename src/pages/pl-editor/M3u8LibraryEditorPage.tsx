import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../hooks/AppContext';
import useScrollableCachedSongList, { ThinSongListState } from '../../hooks/list/useScrollableCachedSongList';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useNavigate } from 'react-router-dom';
import { getM3u8Playlists } from '../../services/pl-content';
import { Song } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import { LOCAL_LIBRARY_EDIT_CACHE } from '../../hooks/cache/cache-names';
import useLibrary from '../../hooks/list/useLibrary';
import '/src/styles/wide-page.scss';
import '/src/styles/list/list-with-1x-secondary-action.scss';

function M3u8LibraryEditorPage() {
  const navigate = useNavigate();
  const { mopidy, online, credentials } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    goToPlAdd,
    currentSong,
    getCache,
    mergeCache,
  } = useScrollableCachedSongList<ThinSongListState>(LOCAL_LIBRARY_EDIT_CACHE);
  const { removePlaylist } = useLibrary(sustain);

  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[PlaylistEditorPage]`, currentSong, cache, state, credentials);

  const handleReload = useCallback(() => {
    console.log(`[PlaylistEditorPage.useEffect] loading the Mopidy playlists`);
    sustain(
      getM3u8Playlists(mopidy).then((songs) => ({ songs })),
      `Failed to load the Mopidy playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[PlaylistEditorPage.useEffect] the Mopidy playlists are already loaded!`);
      return;
    }
    online && handleReload();
  }, [handleReload, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[PlaylistEditorPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[PlaylistEditorPage] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state]);

  const handleClick = useCallback(
    (playlist: Song) => {
      // console.log(`[PlaylistEditorPage.handlePlSelection] song:`, song);
      mergeCache((old) => ({ ...old, lastUsed: playlist }));
      // navigate(`/playlist-edit-from-current-play/${encodeURIComponent(song.uri)}?${toQueryParams(['title', encodeURIComponent(song.title)])}`);
      navigate(
        `/playlist-edit-from-current-play/${playlist.uri}?${toQueryParams(['title', playlist.title])}`
      );
    },
    [mergeCache, navigate]
  );

  const removePl = useCallback(
    (playlist: Song) => {
      removePlaylist(playlist).then(() =>
        setState((old) => ({ ...old, songs: old.songs.filter((s) => s.uri != playlist.uri) }))
      );
    },
    [removePlaylist, setState]
  );

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        className="list-with-1x-secondary-action"
        songs={state.songs}
        loading={state.loading}
        currentSong={currentSong}
        onClick={handleClick}
        onDelete={credentials.isValid() ? removePl : undefined}
        onAddAllSongs={goToPlAdd}
        onReloadList={handleReload}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default M3u8LibraryEditorPage;
