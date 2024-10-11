import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { copyRawSongsPageState, RawSongsPageState } from '../../hooks/list/useSongList';
import { SetFeedbackState } from '../../lib/sustain';
import { useNavigate } from 'react-router-dom';
import { getM3u8Playlists } from '../../services/pl-content';
import { scrollTop } from '../../domain/scroll';
import { Song } from '../../domain/song';
import { MOPIDY_PLAYLISTS_CACHE, MopidyPlaylistsCache } from '../local-playlists/LocalPlaylistsPage';
import { toQueryParams } from '../../lib/path-param-utils';
import '/src/styles/wide-list-page.scss';
import './PlaylistEditOptionsPage.scss';

function PlaylistEditOptionsPage() {
  const navigate = useNavigate();
  const { mopidy, online, getCache, mergeCache } = useContext(AppContext);
  const { state, sustain, setState, listRef, scrollObserver, scrollTo, currentSong } =
    useSongList<RawSongsPageState>(MOPIDY_PLAYLISTS_CACHE);
  const cache = getCache(MOPIDY_PLAYLISTS_CACHE) as MopidyPlaylistsCache;
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
    if (!state.songs.length) {
      console.log(`[PlaylistEditOptionsPage.useEffect] no songs to backup!`);
      return;
    }
    mergeCache(MOPIDY_PLAYLISTS_CACHE, (old) => {
      const backup = { ...copyRawSongsPageState(state), scrollTop: scrollTop(old) };
      console.log(`[PlaylistEditOptionsPage] stateBackup:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const handlePlSelection = useCallback(
    (playlist: Song) => {
      // console.log(`[PlaylistEditOptionsPage.handlePlSelection] song:`, song);
      mergeCache(MOPIDY_PLAYLISTS_CACHE, (old) => {
        const backup = { ...(old as object), scrollTop: scrollTop(old), lastUsed: playlist };
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

  const goToPlAdd = useCallback(() => {
    navigate('/add-playlist');
  }, [navigate]);

  return (
    <PageTemplate
      className="wide-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        className="pl-edit-options-list"
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
