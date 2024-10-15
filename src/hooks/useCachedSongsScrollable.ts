import { LoadingState, SetLoadingState } from '../lib/sustain';
import { Song, ThinSongListState } from '../domain/song';
import { NoArgsProc } from '../domain/types';
import useCachedPositionScrollable, {
  ScrollPosition,
  UseCachedPositionScrollable,
} from './scrollable/useCachedPositionScrollable';
import { SustainVoidFn, useSustainableState } from './useSustainableState';
import { UsePlayingList, usePlayingList } from './usePlayingList';
import { NamedTypedCacheOperations, useNamedCache } from './cache/useNamedCache';
import useAppNavigator from './useAppNavigator';
import { useCallback, useContext } from 'react';
import { getLocalPlaylists } from '../services/pl-content';
import { AppContext } from './AppContext';
import useLibrary from './useLibrary';

export interface UseSongList<S extends ThinSongListState>
  extends UsePlayingList,
    NamedTypedCacheOperations<S & ScrollPosition>,
    UseCachedPositionScrollable {
  addSongThenPlay: (song: Song) => void;
  goToPlAdd: NoArgsProc;
  state: LoadingState<S>;
  sustain: SustainVoidFn<S>;
  setState: SetLoadingState<S>;
  loadLocalLibrary: () => void;
  removePlaylist: (playlist: Song) => void;
}

export default function useCachedSongsScrollable<S extends ThinSongListState>(
  cacheName: string,
  defaultState?: Partial<LoadingState<S>> | null
): UseSongList<S> {
  const { mopidy } = useContext(AppContext);
  const { getCache, ...useNamedCacheRest } = useNamedCache<S & ScrollPosition>(cacheName);

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

  const { removePlaylist: removePlaylistWithNoStateChange } = useLibrary(sustain);

  const removePlaylist = useCallback(
    (playlist: Song) => {
      removePlaylistWithNoStateChange(playlist).then(() =>
        setState((old) => ({ ...old, songs: old.songs.filter((s) => s.uri != playlist.uri) }))
      );
    },
    [removePlaylistWithNoStateChange, setState]
  );

  const loadLocalLibrary = useCallback(() => {
    console.log(`[useCachedSongsScrollable.loadLocalLibrary] loading the local library`);
    sustain(
      getLocalPlaylists(mopidy).then((songs) => ({ songs }) as Partial<S>),
      `Failed to load the local library!`
    );
  }, [mopidy, sustain]);

  return {
    ...useAppNavigator(),
    ...usePlayingList(sustain),
    ...useCachedPositionScrollable(cacheName),
    ...useNamedCacheRest,
    getCache,
    state,
    sustain,
    setState,
    loadLocalLibrary,
    removePlaylist,
  };
}
