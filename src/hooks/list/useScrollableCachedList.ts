import { RefObject, useCallback, useContext } from 'react';
import { ScrollToFn } from '../../domain/scroll';
import useScrollable from '../useScrollable';
import { NamedTypedCacheOperations, useNamedTypedCache } from '../cache/useNamedTypedCache';
import { AppContext } from '../AppContext';

export interface ScrollPosition {
  scrollTop?: number | null;
}

export interface UseScrollableCachedList<S> extends NamedTypedCacheOperations<S & ScrollPosition> {
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
}

export default function useScrollableCachedList<S>(cacheName: string): UseScrollableCachedList<S> {
  const [scrollTo, listRef] = useScrollable<HTMLUListElement>();

  const untypedCacheOperations = useContext(AppContext);
  const typedCacheOperations = useNamedTypedCache<S & ScrollPosition>(cacheName, untypedCacheOperations);
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
