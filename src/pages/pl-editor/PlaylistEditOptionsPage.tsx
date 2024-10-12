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

export const PLAYLISTS_EDIT_CACHE = 'playlists/edit';

function PlaylistEditOptionsPage() {
  const navigate = useNavigate();
  const { mopidy, online } = useContext(AppContext);
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
  console.log(`[PlaylistEditOptionsPage]`, { currentSong, cache, state });

  const handleReload = useCallback(() => {
    console.log(`[PlaylistEditOptionsPage.useEffect] loading the Mopidy playlists`);
    sustain(
      getM3u8Playlists(mopidy).then((songs) => ({ songs })),
      `Failed to load the Mopidy playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[PlaylistEditOptionsPage.useEffect] the Mopidy playlists are already loaded!`);
      return;
    }
    online && handleReload();
  }, [handleReload, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[PlaylistEditOptionsPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[PlaylistEditOptionsPage] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => {
      const backup = { ...old, ...removeLoadingAttributes(state) };
      console.log(`[PlaylistEditOptionsPage] stateBackup:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const handlePlSelection = useCallback(
    (playlist: Song) => {
      // console.log(`[PlaylistEditOptionsPage.handlePlSelection] song:`, song);
      mergeCache((old) => {
        const backup = { ...old, lastUsed: playlist };
        console.log(`[PlaylistEditOptionsPage] stateBackup:`, backup);
        return backup;
      });
      // navigate(`/playlist-edit-from-current-play/${encodeURIComponent(song.uri)}?${toQueryParams(['title', encodeURIComponent(song.title)])}`);
      navigate(
        `/playlist-edit-from-current-play/${playlist.uri}?${toQueryParams(['title', playlist.title])}`
      );
    },
    [mergeCache, navigate]
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
        onClick={handlePlSelection}
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

export default PlaylistEditOptionsPage;
