import Mopidy from 'mopidy';
import { useCallback, useContext } from 'react';
import { AppContext } from '../../components/app/AppContext';
import {
  addSongsAndRemember,
  addSongThenPlay,
  addSongsAfterAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { LoadingState } from '../../lib/sustain';
import { Song, isYtMusicPl } from '../../domain/song';
import { TrackSong } from '../../domain/track-song';
import { AddAllSongsFn } from '../../domain/SongListItemMenuParam';
import useCachedList, { UseCachedList } from './useCachedList';
import { NoArgsProc } from '../../domain/types';
import { useNavigate } from 'react-router-dom';

/**
 * The purpose of this structure is to provide the basic state
 * (and cache) structure for the features extending useSongList.
 */
export interface ThinSongListState {
  songs: Song[];
  lastUsed?: Song | null;
}

export function copyThinSongListState(rawState?: ThinSongListState | null): ThinSongListState {
  return {
    songs: rawState == null ? [] : rawState.songs,
    lastUsed: rawState?.lastUsed,
  };
}

export interface UseSongList<S extends ThinSongListState> extends UseCachedList<S> {
  handleSelection: (song: Song) => void;
  handleAdd: (song: Song) => void;
  handleAddAll: AddAllSongsFn;
  handleInsert: (song: Song) => void;
  goToPlAdd: NoArgsProc;
  currentSong?: TrackSong;
  mopidy?: Mopidy;
}

export default function useSongList<S extends ThinSongListState>(
  cacheName: string,
  defaultState?: Partial<LoadingState<S>> | null
): UseSongList<S> {
  const navigate = useNavigate();
  const { mopidy, currentSong } = useContext(AppContext);

  const { sustain, ...cachedListRest } = useCachedList<S>(cacheName, {
    songs: [],
    ...defaultState,
  } as LoadingState<S>);
  // console.log(`[useSongsList]`, { cache, state });

  const handleSelection = useCallback(
    (song: Song) => {
      // console.log(`[useSongsList:handleSelection] song:\n`, song);
      sustain(
        addSongThenPlay(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<S>),
        { error: `Failed to start ${song.title}!`, lastUsed: song } as Partial<LoadingState<S>>
      );
    },
    [mopidy, sustain]
  );

  const handleAddAll = useCallback(
    (songs: Song[]) => {
      // console.log(`[useSongsList:handleAddAll] songs:\n`, songs);
      sustain(
        addSongsAndRemember(mopidy, ...songs) /* {
        error: `Failed to add ${songs.length} songs!`,
      } as Partial<LoadingState<S>> */
      );
    },
    [mopidy, sustain]
  );

  const handleAdd = useCallback(
    (song: Song) => {
      console.log(`[useSongsList:onAdd] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      const addFn = isYtMusicPl(song) ? addYtMusicPlAndRemember : addSongsAndRemember;
      sustain(
        addFn(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<S>)
        // { error: `Failed to add ${song.title}!`, lastUsed: song } as Partial<LoadingState<S>>
      );
    },
    [mopidy, sustain]
  );

  const handleInsert = useCallback(
    (song: Song) => {
      // song.location.uri = 'ytmusic:track:sk_K10Modes';
      // console.log(`[useSongsList:onAdd] song:\n`, song);
      const addAfterFn = isYtMusicPl(song) ? addYtMusicPlAfterAndRemember : addSongsAfterAndRemember;
      sustain(
        addAfterFn(mopidy, currentSong, song)?.then(() => ({ lastUsed: song }) as Partial<S>),
        { error: `Failed to start ${song.title}!`, lastUsed: song } as Partial<LoadingState<S>>
      );
    },
    [mopidy, sustain, currentSong]
  );

  const goToPlAdd = useCallback(() => {
    navigate('/add-playlist');
  }, [navigate]);

  return {
    ...cachedListRest,
    sustain,
    handleSelection,
    handleAdd,
    handleAddAll,
    handleInsert,
    goToPlAdd,
    currentSong,
    mopidy,
  };
}
