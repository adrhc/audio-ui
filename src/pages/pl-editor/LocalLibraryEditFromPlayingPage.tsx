import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../hooks/AppContext';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useNavigate } from 'react-router-dom';
import { getM3u8Playlists } from '../../services/pl-content';
import { Song, ThinSongListState } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import { LOCAL_LIBRARY_EDIT_CACHE } from '../../hooks/cache/cache-names';
import useLibrary from '../../hooks/useLibrary';
import '/src/styles/wide-page.scss';
import '/src/styles/list/list-with-1x-secondary-action.scss';

function LocalLibraryEditFromPlayingPage() {
  const navigate = useNavigate();
  const { mopidy, online, credentials } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    getScrollPosition,
    goToPlAdd,
    currentSong,
    mergeCache,
  } = useCachedSongsScrollable<ThinSongListState>(LOCAL_LIBRARY_EDIT_CACHE);
  const { removePlaylist } = useLibrary(sustain);

  const songsIsEmpty = state.songs.length == 0;
  console.log(`[LocalLibraryEditFromPlayingPage]`, currentSong, state, credentials);

  const handleReload = useCallback(() => {
    console.log(`[LocalLibraryEditFromPlayingPage.useEffect] loading the Mopidy playlists`);
    sustain(
      getM3u8Playlists(mopidy).then((songs) => ({ songs })),
      `Failed to load the Mopidy playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[LocalLibraryEditFromPlayingPage.useEffect] the Mopidy playlists are already loaded!`);
      return;
    }
    online && handleReload();
  }, [handleReload, online, songsIsEmpty]);

  // scroll after loading the library
  const scrollPosition = getScrollPosition();
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalLibraryEditFromPlayingPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalLibraryEditFromPlayingPage] scrolling to ${scrollPosition} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(scrollPosition);
  }, [scrollPosition, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state]);

  const handleClick = useCallback(
    (playlist: Song) => {
      // console.log(`[LocalLibraryEditFromPlayingPage.handlePlSelection] song:`, song);
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
        addManySongs={goToPlAdd}
        onReloadList={handleReload}
        lastUsed={state.lastUsed}
        listRef={listRef}
        onScroll={scrollObserver}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default LocalLibraryEditFromPlayingPage;
