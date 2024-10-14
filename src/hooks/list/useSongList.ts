import Mopidy from 'mopidy';
import { useCallback, useContext } from 'react';
import { AppContext } from '../AppContext';
import {
  addSongsAndRemember,
  addSongThenPlay,
  addSongsAfterAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { LoadingState, SetLoadingState } from '../../lib/sustain';
import { Song, isYtMusicPl } from '../../domain/song';
import { TrackSong } from '../../domain/track-song';
import { AddAllSongsFn } from '../../domain/SongListItemMenuParam';
import { NoArgsProc } from '../../domain/types';
import { useNavigate } from 'react-router-dom';
import useScrollableCachedList, { ScrollPosition, UseScrollableCachedList } from './useScrollableCachedList';
import { SustainVoidFn, useSustainableState } from '../useSustainableState';

/**
 * The purpose of this structure is to provide the basic state
 * (and cache) structure for the features extending useSongList.
 */
export interface ThinSongListState {
  songs: Song[];
  lastUsed?: Song | null;
}

export interface UseSongList<S extends ThinSongListState> extends UseScrollableCachedList<S> {
  handleSelection: (song: Song) => void;
  handleAdd: (song: Song) => void;
  handleAddAll: AddAllSongsFn;
  handleInsert: (song: Song) => void;
  goToPlAdd: NoArgsProc;
  state: LoadingState<S>;
  sustain: SustainVoidFn<S>;
  setState: SetLoadingState<S>;
  currentSong?: TrackSong;
  mopidy?: Mopidy;
}

export default function useSongList<S extends ThinSongListState>(
  cacheName: string,
  defaultState?: Partial<LoadingState<S>> | null
): UseSongList<S> {
  const navigate = useNavigate();
  const { mopidy, currentSong } = useContext(AppContext);

  const { getCache, ...scrollableCachedList } = useScrollableCachedList<S>(cacheName);
  const cache = getCache();

  const properDefaultState = {
    songs: [],
    ...defaultState,
    ...cache,
  } as LoadingState<S> & ScrollPosition;
  // the cache contains scrollTop which might not be part of S!
  if (!defaultState || (defaultState && !('scrollTop' in defaultState))) {
    delete properDefaultState.scrollTop;
  } else if ('scrollTop' in properDefaultState) {
    console.warn(`[useSongList] keeping state.scrollTop = ${properDefaultState?.scrollTop}`, {
      defaultState,
      properDefaultState,
    });
  }

  const [state, sustain, setState] = useSustainableState<S>(properDefaultState);
  // console.log(`[useSongsList]`, { [`${cacheName} cache`]: cache, state });

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
    ...scrollableCachedList,
    getCache,
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleAddAll,
    handleInsert,
    goToPlAdd,
    currentSong,
    mopidy,
  };
}
