import { LoadingState, SetLoadingState } from '../lib/sustain';
import { Song, SongsAware, ThinSongListState } from '../domain/song';
import { NoArgsProc } from '../domain/types';
import useCachedPositionScrollable, {
  ScrollPosition,
  UseCachedPositionScrollable,
} from './scrollable/useCachedPositionScrollable';
import { SustainVoidFn, useSustainableState } from './useSustainableState';
import { UsePlayingList, usePlayingList } from './usePlayingList';
import { NamedTypedCacheOperations, useNamedCache } from './cache/useNamedCache';
import useAppNavigator from './useAppNavigator';
import useLibraryAwareState, { UseSongsAwareState } from './useLibraryAwareState';

export interface UseSongList<S extends ThinSongListState>
  extends UsePlayingList,
    UseSongsAwareState,
    NamedTypedCacheOperations<S & ScrollPosition>,
    UseCachedPositionScrollable {
  addSongThenPlay: (song: Song) => void;
  goToPlAdd: NoArgsProc;
  state: LoadingState<S>;
  sustain: SustainVoidFn<S>;
  setState: SetLoadingState<S>;
}

export default function useCachedSongsScrollable<S extends ThinSongListState>(
  cacheName: string,
  defaultState?: Partial<LoadingState<S>> | null
): UseSongList<S> {
  const { getCache, ...useNamedCacheRest } = useNamedCache<S & ScrollPosition>(cacheName);

  const cacheBasedDefaultState = toCacheBasedDefaultState<S>(getCache(), defaultState);

  const [state, sustain, setState] = useSustainableState<S>(cacheBasedDefaultState);
  // console.log(`[useSongsList]`, { [`${cacheName} cache`]: getCache(), state });

  return {
    ...useAppNavigator(),
    ...usePlayingList(sustain),
    ...useCachedPositionScrollable(cacheName),
    ...useLibraryAwareState(sustain, setState),
    ...useNamedCacheRest,
    getCache,
    state,
    sustain,
    setState,
  };
}

function toCacheBasedDefaultState<S extends SongsAware>(
  cache?: (S & ScrollPosition) | null,
  defaultState?: Partial<LoadingState<S>> | null
): LoadingState<S> {
  if (cache && (!defaultState || (defaultState && !('scrollTop' in defaultState)))) {
    console.warn(`[useSongList] removing scrollTop from the cache used to construct the default state`);
    delete cache.scrollTop;
  } else {
    console.warn(`[useSongList] cache.scrollTop overwrites defaultState.scrollTop:`, {
      cache,
      defaultState,
    });
  }
  return { songs: [], ...defaultState, ...cache } as LoadingState<S>;
}
