import { RefObject, useCallback } from 'react';
import { ScrollToFn } from '../../domain/scroll';
import useScrollable from '../useScrollable';
import { NamedTypedCacheOperations, useTypedCache } from '../cache/useTypedCache';

export interface ScrollPosition {
  scrollTop?: number | null;
}

export interface UseScrollableCachedList<S extends ScrollPosition> extends NamedTypedCacheOperations<S> {
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
}

export default function useCachedPositionScrollable<S extends ScrollPosition>(
  cacheName: string
): UseScrollableCachedList<S> {
  const [scrollTo, listRef] = useScrollable<HTMLUListElement>();

  const typedCacheOperations = useTypedCache<S>(cacheName);
  const { mergeCache } = typedCacheOperations;

  const scrollObserver = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      mergeCache((old) => {
        // console.log(`[useScrollableCachedList.scrollObserver] old "${cacheName}" cache:`, old);
        // console.log(`[useScrollableCachedList.scrollObserver] scroll from ${old?.scrollTop} to ${scrollTop}`);
        return { ...old, scrollTop };
      });
    },
    [mergeCache]
  );

  return {
    listRef,
    scrollObserver,
    scrollTo,
    ...typedCacheOperations,
  };
}
