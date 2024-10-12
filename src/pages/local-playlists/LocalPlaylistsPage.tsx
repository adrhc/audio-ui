import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { ThinSongListState } from '../../hooks/list/useSongList';
import { Song, isYtMusicPl } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import {
  addMopidyPlAfterAndRemember,
  addMopidyPlAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { getM3u8Playlists } from '../../services/pl-content';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import '/src/styles/wide-page.scss';

export const MOPIDY_PLAYLISTS_CACHE = 'local-playlists';

function LocalPlaylistsPage() {
  const navigate = useNavigate();
  const { mopidy, online } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    currentSong,
    getCache,
    mergeCache,
    clearCache,
  } = useSongList<ThinSongListState>(MOPIDY_PLAYLISTS_CACHE);
  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[LocalPlaylistsPage]`, { currentSong, cache, state });

  const handleReaload = useCallback(() => {
    console.log(`[handleReaload] loading the local playlists`);
    sustain(
      getM3u8Playlists(mopidy).then((songs) => ({ songs })),
      `Failed to load the local playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[LocalPlaylistsPage.useEffect] the local playlists are already loaded!`);
      return;
    }
    online && handleReaload();
  }, [handleReaload, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalPlaylistsPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalPlaylistsPage.useEffect] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => {
      // state doesn't contain scrollTop hence won't overwrite the cache!
      const backup = { ...old, ...removeLoadingAttributes(state) };
      console.log(`[LocalPlaylistsPage.useEffect/mergeCache] backup:`, { old, backup });
      return backup;
    });
  }, [clearCache, mergeCache, state]);

  const handlePlSelection = useCallback(
    (song: Song) => {
      mergeCache((old) => {
        const backup = { ...old, lastUsed: song };
        console.log(`[LocalPlaylistsPage] stateBackup:`, backup);
        return backup;
      });
      navigate(`/local-playlist-content/${song.uri}`);
    },
    [mergeCache, navigate]
  );

  const handleAddPl = useCallback(
    (song: Song) => {
      console.log(`[LocalPlaylistsPage.handleAddPl] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      const addFn = isYtMusicPl(song) ? addYtMusicPlAndRemember : addMopidyPlAndRemember;
      sustain(
        addFn(mopidy, song)?.then(() => ({ lastUsed: song })),
        { error: `Failed to add ${song.title}!`, lastUsed: song }
      );
    },
    [mopidy, sustain]
  );

  const handleInsertPl = useCallback(
    (song: Song) => {
      console.log(`[LocalPlaylistsPage.handleInsertPl] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      const insertFn = isYtMusicPl(song) ? addYtMusicPlAfterAndRemember : addMopidyPlAfterAndRemember;
      sustain(
        insertFn(mopidy, currentSong, song)?.then(() => ({ lastUsed: song })),
        { error: `Failed to add ${song.title}!`, lastUsed: song }
      );
    },
    [currentSong, mopidy, sustain]
  );

  const goToPlAdd = useCallback(() => {
    navigate('/add-playlist');
  }, [navigate]);

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
        songs={state.songs}
        loading={state.loading}
        currentSong={currentSong}
        onAdd={handleAddPl}
        onAddAllSongs={goToPlAdd}
        onInsert={handleInsertPl}
        onClick={handlePlSelection}
        onReloadList={handleReaload}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default LocalPlaylistsPage;
