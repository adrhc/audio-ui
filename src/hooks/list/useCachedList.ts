import { RefObject, useCallback, useContext } from 'react';
import { LoadingState, SetLoadingState } from '../../lib/sustain';
import { AppContext } from '../../components/app/AppContext';
import { SustainVoidFn, useSustainableState } from '../useSustainableState';
import { ScrollToFn } from '../../domain/scroll';
import useScroll from '../useScroll';

export interface UseCachedList<S> {
  state: LoadingState<S>;
  sustain: SustainVoidFn<S>;
  setState: SetLoadingState<S>;
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
}

export default function useCachedList<S>(
  cacheName: string,
  defaultState?: Partial<LoadingState<S>> | null
): UseCachedList<S> {
  const [scrollTo, listRef] = useScroll<HTMLUListElement>();
  const { getCache, mergeCache } = useContext(AppContext);
  const cache = getCache(cacheName) as S;
  const [state, sustain, setState] = useSustainableState<S>({
    ...defaultState,
    ...(cache as object),
  } as LoadingState<S>);

  const scrollObserver = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      // console.log(`[useSongsList:scrollObserver] new scrollTop:`, scrollTop);
      mergeCache(cacheName, (old) => {
        // console.log(`[scrollObserver] old scrollTop = ${getScrollTop(old)}, new scrollTop = ${scrollTop}`);
        return { ...(old as object), scrollTop };
      });
    },
    [cacheName, mergeCache]
  );

  return { state, sustain, setState, listRef, scrollObserver, scrollTo };
}
