import { RefObject, useCallback, useContext } from 'react';
import { ScrollToFn } from '../../domain/scroll';
import useScroll from '../useScroll';
import { MergeFn, NamedTypedCacheOperations } from '../cache/useNamedTypedCache';
import { AppContext } from '../../components/app/AppContext';

export interface ScrollPosition {
  scrollTop?: number | null;
}

export interface UseScrollableCachedList<S> extends NamedTypedCacheOperations<S & ScrollPosition> {
  listRef: RefObject<HTMLUListElement>;
  scrollObserver: (e: React.UIEvent<HTMLUListElement>) => void;
  scrollTo: ScrollToFn;
}

export default function useScrollableCachedList<S>(cacheName: string): UseScrollableCachedList<S> {
  const [scrollTo, listRef] = useScroll<HTMLUListElement>();

  // const { getCache, mergeCache, ...namedTypedCacheRest } = useNamedTypedCache<S & ScrollPosition>(cacheName);

  // BEGIN typed cache
  // somehow replicating useNamedTypedCache definition; see the comment on useNamedTypedCache
  const {
    getCache: getTypedCache,
    setCache: setTypedCache,
    mergeCache: mergeTypedCache,
    clearCache: clearTypedCache,
    cacheContains: typedCacheContains,
  } = useContext(AppContext);

  const getCache = useCallback(() => {
    // console.log(`[getCache] cacheName = ${cacheName}`);
    return getTypedCache(cacheName) as S & ScrollPosition;
  }, [cacheName, getTypedCache]);

  const setCache = useCallback(
    (value: S) => {
      // console.log(`[setCache] cacheName = ${cacheName}`);
      setTypedCache(cacheName, value);
    },
    [cacheName, setTypedCache]
  );

  const mergeCache = useCallback(
    (mergeFn: MergeFn<S & ScrollPosition>) => {
      // console.log(`[mergeCache] cacheName = ${cacheName}`);
      return mergeTypedCache(cacheName, mergeFn as MergeFn<unknown>);
    },
    [cacheName, mergeTypedCache]
  );

  const clearCache = useCallback(() => clearTypedCache(cacheName), [cacheName, clearTypedCache]);
  const cacheContains = useCallback(() => typedCacheContains(cacheName), [cacheName, typedCacheContains]);
  // END typed cache

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
    getCache,
    setCache,
    mergeCache,
    clearCache,
    cacheContains,
  };
}
