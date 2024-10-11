import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { RawSongsPageState, copyRawSongsPageState } from '../../hooks/list/useSongList';
import { Song, isYtMusicPl } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { scrollTop } from '../../domain/scroll';
import {
  addMopidyPlAfterAndRemember,
  addMopidyPlAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { getM3u8Playlists } from '../../services/pl-content';
import { SetFeedbackState } from '../../lib/sustain';
import '/src/styles/wide-list-page.scss';

export type MopidyPlaylistsCache = { scrollTop: number } & RawSongsPageState;
export const MOPIDY_PLAYLISTS_CACHE = 'mopidy-playlists';

function MopidyPlaylistsPage() {
  const navigate = useNavigate();
  const { mopidy, online, getCache, mergeCache } = useContext(AppContext);
  const { state, sustain, setState, listRef, scrollObserver, scrollTo, currentSong } =
    useSongList<RawSongsPageState>(MOPIDY_PLAYLISTS_CACHE);
  const cache = getCache(MOPIDY_PLAYLISTS_CACHE) as MopidyPlaylistsCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[MopidyPlaylistsPage]`, { currentSong, cache, state });

  const handleReaload = useCallback(() => {
    console.log(`[MopidyPlaylistsPage.useEffect] loading the Mopidy playlists`);
    sustain(
      getM3u8Playlists(mopidy).then((songs) => ({ songs })),
      `Failed to load the Mopidy playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[MopidyPlaylistsPage.useEffect] the Mopidy playlists are already loaded!`);
      return;
    }
    online && handleReaload();
  }, [handleReaload, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[MopidyPlaylistsPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[MopidyPlaylistsPage] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    if (!state.songs.length) {
      console.log(`[MopidyPlaylistsPage.useEffect] no songs to backup!`);
      return;
    }
    mergeCache(MOPIDY_PLAYLISTS_CACHE, (old) => {
      const backup = { ...copyRawSongsPageState(state), scrollTop: scrollTop(old) };
      console.log(`[MopidyPlaylistsPage] stateBackup:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const handlePlSelection = useCallback(
    (song: Song) => {
      // console.log(`[MopidyPlaylistsPage.handlePlSelection] song:`, song);
      mergeCache(MOPIDY_PLAYLISTS_CACHE, (old) => {
        const backup = { ...(old as object), scrollTop: scrollTop(old), lastUsed: song };
        console.log(`[MopidyPlaylistsPage] stateBackup:`, backup);
        return backup;
      });
      navigate(`/mopidy-plitems/${song.uri}`);
    },
    [mergeCache, navigate]
  );

  const handleAddPl = useCallback(
    (song: Song) => {
      console.log(`[MopidyPlaylistsPage:handleAddPl] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
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
      console.log(`[MopidyPlaylistsPage:handleInsertPl] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      const insertFn = isYtMusicPl(song) ? addYtMusicPlAfterAndRemember : addMopidyPlAfterAndRemember;
      sustain(
        insertFn(mopidy, currentSong, song)?.then(() => ({ lastUsed: song })),
        { error: `Failed to add ${song.title}!`, lastUsed: song }
      );
    },
    [currentSong, mopidy, sustain]
  );

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
        songs={state.songs}
        loading={state.loading}
        currentSong={currentSong}
        onAdd={handleAddPl}
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

export default MopidyPlaylistsPage;
