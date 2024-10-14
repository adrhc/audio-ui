import { RefObject, useCallback } from 'react';
import { ScrollToFn } from '../../domain/scroll';
import { useNamedCache } from '../cache/useNamedCache';
import useScrollable from './useScrollable';

export interface ScrollPosition {
  scrollTop?: number | null;
}

export interface UseCachedPositionScrollable {
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
  getScrollPosition(): number;
}

export default function useCachedPositionScrollable(cacheName: string): UseCachedPositionScrollable {
  const [scrollTo, listRef] = useScrollable<HTMLUListElement>();

  const { getCache, mergeCache } = useNamedCache<ScrollPosition>(cacheName);

  const scrollObserver = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const scrollPosition = e.currentTarget.scrollTop;
      mergeCache((old) => {
        // console.log(`[useScrollableCachedList.scrollObserver] old "${cacheName}" cache:`, old);
        // console.log(`[useScrollableCachedList.scrollObserver] scroll from ${old?.scrollTop} to ${scrollTop}`);
        return { ...old, scrollTop: scrollPosition };
      });
    },
    [mergeCache]
  );

  const getScrollPosition = useCallback(() => {
    return getCache()?.scrollTop ?? 0;
  }, [getCache]);

  return {
    listRef,
    scrollObserver,
    scrollTo,
    getScrollPosition,
  };
}
