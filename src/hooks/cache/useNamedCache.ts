import { useCallback, useContext } from 'react';
import { NoArgsProc } from '../../domain/types';
import { AppContext } from '../AppContext';

export type GetCacheFn<S> = () => S | null | undefined;
export type SetCacheFn<S> = (value: S) => void;
export type MergeFn<S> = (oldValue: S) => S;
export type MergeCacheFn<S> = (mergeFn: MergeFn<S>) => void;
export type ClearCacheFn = () => void;
export type CacheContainsFn = () => boolean;

export interface NamedTypedCacheOperations<S> {
  getCache: GetCacheFn<S>;
  setCache: SetCacheFn<S>;
  cacheContains: CacheContainsFn;
  mergeCache: MergeCacheFn<S>;
  clearCache: ClearCacheFn;
  clearLocalLibraryCache: NoArgsProc;
}

/**
 * Useful only while in page because after exiting the cache is
 * lost; use the cache with useContext(AppContext) to not lose it!
 */
export function useNamedCache<S>(cacheName: string): NamedTypedCacheOperations<S> {
  const {
    getCache: getTypedCache,
    setCache: setTypedCache,
    cacheContains: typedCacheContains,
    mergeCache: mergeTypedCache,
    clearCache: clearTypedCache,
    clearLocalLibraryCache,
  } = useContext(AppContext); // must use the cache through AppContext to persist between pages!

  const getCache = useCallback(() => {
    // console.log(`[getCache] cacheName = ${cacheName}`);
    return getTypedCache(cacheName) as S;
  }, [cacheName, getTypedCache]);

  const setCache = useCallback(
    (value: S) => {
      // console.log(`[setCache] cacheName = ${cacheName}`);
      setTypedCache(cacheName, value);
    },
    [cacheName, setTypedCache]
  );

  const mergeCache = useCallback(
    (mergeFn: MergeFn<S>) => {
      // console.log(`[mergeCache] cacheName = ${cacheName}`);
      return mergeTypedCache(cacheName, mergeFn as MergeFn<unknown>);
    },
    [cacheName, mergeTypedCache]
  );

  const clearCache = useCallback(() => clearTypedCache(cacheName), [cacheName, clearTypedCache]);
  const cacheContains = useCallback(() => typedCacheContains(cacheName), [cacheName, typedCacheContains]);

  return { getCache, setCache, mergeCache, cacheContains, clearCache, clearLocalLibraryCache };
}
