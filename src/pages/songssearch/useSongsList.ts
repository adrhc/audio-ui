import Mopidy from 'mopidy';
import { RefObject, useCallback, useContext } from 'react';
import { AppContext } from '../../components/app/AppContext';
import { SustainVoidFn, useSustainableState } from '../../hooks/useSustainableState';
import {
  addSongsAndRemember,
  addSongThenPlay,
  addSongsAfterAndRemember,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../../services/tracklist';
import { LoadingState, SetLoadingState } from '../../lib/sustain';
import useScroll from '../../hooks/useScroll';
import { Song, isYtMusicPl } from '../../domain/song';
import { TrackSong } from '../../domain/track-song';
import { AddAllSongsFn } from '../../components/list/navigator-commons';
import { ScrollToFn } from '../../domain/scroll';

export type RawSongsPageState = {
  songs: Song[];
  lastUsed?: Song | null;
};

export function pickRawSongsPageState(rawState?: RawSongsPageState | null) {
  return rawState == null
    ? rawState
    : ({
        songs: rawState.songs,
        lastUsed: rawState.lastUsed,
      } as RawSongsPageState);
}

export interface UseSongsList<P extends RawSongsPageState> {
  state: LoadingState<P>;
  sustain: SustainVoidFn<P>;
  setState: SetLoadingState<P>;
  handleSelection: (song: Song) => void;
  handleAdd: (song: Song) => void;
  handleAddAll: AddAllSongsFn;
  handleInsert: (song: Song) => void;
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
  currentSong?: TrackSong;
  mopidy?: Mopidy;
}

export default function useSongsList<P extends RawSongsPageState>(
  cacheName: string,
  defaultState?: Partial<LoadingState<P>> | null
): UseSongsList<P> {
  const { getCache, mergeCache } = useContext(AppContext);
  const cache = getCache(cacheName) as P;
  const [scrollTo, listRef] = useScroll<HTMLUListElement>();
  const [state, sustain, setState] = useSustainableState<P>({
    songs: [],
    ...defaultState,
    ...(cache as object),
  } as LoadingState<P>);
  const { mopidy, currentSong } = useContext(AppContext);
  // console.log(`[useSongsList]`, { cache, state });

  const scrollObserver = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      // console.log(`[scrollObserver] new scrollTop:`, scrollTop);
      mergeCache(cacheName, (old) => {
        // console.log(`[scrollObserver] old scrollTop = ${getScrollTop(old)}, new scrollTop = ${scrollTop}`);
        return { ...(old as object), scrollTop };
      });
    },
    [cacheName, mergeCache]
  );

  const handleSelection = useCallback(
    (song: Song) => {
      // console.log(`[SongsSearchPage:handleSelection] song:\n`, song);
      sustain(
        addSongThenPlay(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<P>),
        { error: `Failed to start ${song.title}!`, lastUsed: song } as Partial<LoadingState<P>>
      );
    },
    [mopidy, sustain]
  );

  const handleAddAll = useCallback(
    (songs: Song[]) => {
      // console.log(`[SongsSearchPage:handleAddAll] songs:\n`, songs);
      sustain(addSongsAndRemember(mopidy, ...songs), {
        error: `Failed to add ${songs.length} songs!`,
      } as Partial<LoadingState<P>>);
    },
    [mopidy, sustain]
  );

  const handleAdd = useCallback(
    (song: Song) => {
      console.log(`[SongsSearchPage:onAdd] isYtMusicPl=${isYtMusicPl(song)}, song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      const addFn = isYtMusicPl(song) ? addYtMusicPlAndRemember : addSongsAndRemember;
      sustain(
        addFn(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<P>),
        { error: `Failed to add ${song.title}!`, lastUsed: song } as Partial<LoadingState<P>>
      );
    },
    [mopidy, sustain]
  );

  const handleInsert = useCallback(
    (song: Song) => {
      // song.location.uri = 'ytmusic:track:sk_K10Modes';
      // console.log(`[SongsSearchPage:onAdd] song:\n`, song);
      const addAfterFn = isYtMusicPl(song) ? addYtMusicPlAfterAndRemember : addSongsAfterAndRemember;
      sustain(
        addAfterFn(mopidy, currentSong, song)?.then(() => ({ lastUsed: song }) as Partial<P>),
        { error: `Failed to start ${song.title}!`, lastUsed: song } as Partial<LoadingState<P>>
      );
    },
    [mopidy, sustain, currentSong]
  );

  return {
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleAddAll,
    handleInsert,
    listRef,
    scrollTo,
    scrollObserver,
    currentSong,
    mopidy,
  };
}
