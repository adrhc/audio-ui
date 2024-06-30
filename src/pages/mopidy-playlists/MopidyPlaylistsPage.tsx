import { Stack } from '@mui/material';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongsList, { RawSongsListState, pickRawSongsListState } from '../songssearch/useSongsList';
import { Song, isYtMusicPl } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { scrollTop } from '../../domain/scroll';
import {
  addMopidyPlAfterAndRemember,
  addMopidyPlAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { getMopidyPlaylists } from '../../services/pl-content';
import '../../templates/SongListPage.scss';
import { SetFeedbackState } from '../../lib/sustain';

type MopidyPlaylistsCache = { scrollTop: number } & RawSongsListState;

function MopidyPlaylistsPage() {
  const navigate = useNavigate();
  const { mopidy, getCache, mergeCache } = useContext(AppContext);
  const [state, sustain, setState, , , , , listRef, scrollTo, scrollObserver, currentSong] =
    useSongsList<RawSongsListState>('mopidy-playlists');
  const cache = getCache('mopidy-playlists') as MopidyPlaylistsCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[MopidyPlaylistsPage]`, { currentSong, cache, state });

  const handleReaload = useCallback(() => {
    console.log(`[MopidyPlaylistsPage.useEffect] loading the Mopidy playlists`);
    sustain(
      getMopidyPlaylists(mopidy).then((songs) => ({ songs })),
      `Failed to load the Mopidy playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[MopidyPlaylistsPage.useEffect] the Mopidy playlists are already loaded!`);
      return;
    }
    handleReaload();
  }, [handleReaload, songsIsEmpty]);

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
    mergeCache('mopidy-playlists', (old) => {
      const backup = { ...pickRawSongsListState(state), scrollTop: scrollTop(old) };
      console.log(`[MopidyPlaylistsPage] stateBackup:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const handleSelectionPl = useCallback(
    (song: Song) => {
      // console.log(`[MopidyPlaylistsPage.handleSelectionPl] song:`, song);
      mergeCache('mopidy-playlists', (old) => {
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
      className="song-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
    >
      <Stack className="songs-wrapper">
        <SongList
          songs={state.songs}
          currentSong={currentSong}
          onAdd={handleAddPl}
          onInsert={handleInsertPl}
          onClick={handleSelectionPl}
          onRealoadList={handleReaload}
          lastUsed={state.lastUsed}
          onScroll={scrollObserver}
          listRef={listRef}
          scrollTo={scrollTo}
        />
      </Stack>
    </PageTemplate>
  );
}

export default MopidyPlaylistsPage;
