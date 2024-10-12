import { RefObject, useCallback } from 'react';
import { ScrollToFn } from '../../domain/scroll';
import useScroll from '../useScroll';
import { NamedTypedCacheOperations, useNamedTypedCache } from '../cache/useNamedTypedCache';

export interface UseScrollableCachedList<S> extends NamedTypedCacheOperations<S> {
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
}

export default function useScrollableCachedList<S>(cacheName: string): UseScrollableCachedList<S> {
  const [scrollTo, listRef] = useScroll<HTMLUListElement>();
  const { getCache, mergeCache, ...namedTypedCacheRest } = useNamedTypedCache<S>(cacheName);

  const scrollObserver = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      // console.log(`[useSongsList:scrollObserver] new scrollTop:`, scrollTop);
      mergeCache((old) => {
        // console.log(`[scrollObserver] old scrollTop = ${getScrollTop(old)}, new scrollTop = ${scrollTop}`);
        return { ...old, scrollTop };
      });
    },
    [mergeCache]
  );

  return {
    listRef,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
    ...namedTypedCacheRest,
  };
}
