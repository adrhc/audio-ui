import { useCallback } from 'react';
import { LoadingState, SetLoadingState } from '../lib/sustain';
import { Song, ThinSongListState } from '../domain/song';
import { NoArgsProc } from '../domain/types';
import { useNavigate } from 'react-router-dom';
import useCachedPositionScrollable, {
  ScrollPosition,
  UseCachedPositionScrollable,
} from './scrollable/useCachedPositionScrollable';
import { SustainVoidFn, useSustainableState } from './useSustainableState';
import { UsePlayingList, usePlayingList } from './usePlayingList';

export interface UseSongList<S extends ThinSongListState>
  extends UsePlayingList,
    UseCachedPositionScrollable<S> {
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
  const navigate = useNavigate();

  const { getCache, ...useCachedPositionScrollableRest } =
    useCachedPositionScrollable<S>(cacheName);

  const properDefaultState = {
    songs: [],
    ...defaultState,
    ...getCache(),
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
  // console.log(`[useSongsList]`, { [`${cacheName} cache`]: getCache(), state });

  const goToPlAdd = useCallback(() => {
    navigate('/add-playlist');
  }, [navigate]);

  return {
    ...usePlayingList(sustain),
    ...useCachedPositionScrollableRest,
    getCache,
    state,
    sustain,
    setState,
    goToPlAdd,
  };
}
