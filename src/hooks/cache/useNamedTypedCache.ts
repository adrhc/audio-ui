import { useCallback } from 'react';
import { useTypedCache } from './useCache';

export type GetCacheFn<S> = () => S | null | undefined;
export type SetCacheFn<S> = (value: S) => void;
export type MergeFn<S> = (oldValue: S) => S;
export type MergeCacheFn<S> = (mergeFn: MergeFn<S>) => void;
export type ClearCacheFn = () => void;
export type CacheContainsFn = () => boolean;

export interface NamedTypedCacheOperations<S> {
  getCache: GetCacheFn<S>;
  setCache: SetCacheFn<S>;
  mergeCache: MergeCacheFn<S>;
  clearCache: ClearCacheFn;
  cacheContains: CacheContainsFn;
}

/**
 * Useful only while in page because after exiting the cache is
 * lost; use the cache with useContext(AppContext) to not lose it!
 */
export function useNamedTypedCache<S>(cacheName: string): NamedTypedCacheOperations<S> {
  const {
    getCache: getTypedCache,
    setCache: setTypedCache,
    mergeCache: mergeTypedCache,
    clearCache: clearTypedCache,
    cacheContains: typedCacheContains,
  } = useTypedCache<S>();

  const getCache = useCallback(() => {
    // console.log(`[getCache] cacheName = ${cacheName}`);
    return getTypedCache(cacheName);
  }, [cacheName, getTypedCache]);

  const setCache = useCallback(
    (value: S) => {
      console.log(`[setCache] cacheName = ${cacheName}`);
      setTypedCache(cacheName, value);
    },
    [cacheName, setTypedCache]
  );

  const mergeCache = useCallback(
    (mergeFn: MergeFn<S>) => {
      // console.log(`[mergeCache] cacheName = ${cacheName}`);
      return mergeTypedCache(cacheName, mergeFn);
    },
    [cacheName, mergeTypedCache]
  );

  const clearCache = useCallback(() => clearTypedCache(cacheName), [cacheName, clearTypedCache]);
  const cacheContains = useCallback(() => typedCacheContains(cacheName), [cacheName, typedCacheContains]);

  return { getCache, setCache, mergeCache, clearCache, cacheContains };
}
