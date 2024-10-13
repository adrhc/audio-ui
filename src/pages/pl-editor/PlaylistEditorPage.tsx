import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { ThinSongListState } from '../../hooks/list/useSongList';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useNavigate } from 'react-router-dom';
import { getM3u8Playlists } from '../../services/pl-content';
import { Song } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import '/src/styles/wide-page.scss';
import '/src/styles/list/list-with-1x-secondary-action.scss';
import { removeDiskPlaylist } from '../../services/audio-db/audio-db';

export const PLAYLISTS_EDIT_CACHE = 'playlists/edit';

function PlaylistEditorPage() {
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
  } = useSongList<ThinSongListState>(PLAYLISTS_EDIT_CACHE);

  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[PlaylistEditorPage]`, { currentSong, cache, state });

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

  const removePlaylist = useCallback(
    (playlist: Song) => {
      console.info(`[PlaylistEditorPage.removePlaylist] playlist:`, playlist);
      sustain(
        removeDiskPlaylist(playlist).then((removed) => {
          if (removed) {
            setState((old) => ({ ...old, songs: old.songs.filter((s) => s.uri != playlist.uri) }));
          } else {
            // console.log(`Couldn't find the playlist to remove! ${playlist.formattedUri}`);
            return { error: `Couldn't find the playlist to remove! ${playlist.formattedUri}` };
          }
        }),
        `Failed to remove the playlist ${playlist.formattedUri}!`
      );
    },
    [setState, sustain]
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
        onDelete={credentials.isValid() ? removePlaylist : undefined}
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

export default PlaylistEditorPage;
