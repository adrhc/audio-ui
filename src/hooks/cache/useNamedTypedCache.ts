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

export function useNamedTypedCache<S>(cacheName: string): NamedTypedCacheOperations<S> {
  const {
    getCache: getTypedCache,
    setCache: setTypedCache,
    mergeCache: mergeTypedCache,
    clearCache: clearTypedCache,
    cacheContains: typedCacheContains,
  } = useTypedCache<S>();

  const getCache = useCallback(() => getTypedCache(cacheName), [cacheName, getTypedCache]);
  const setCache = useCallback((value: S) => setTypedCache(cacheName, value), [cacheName, setTypedCache]);
  const mergeCache = useCallback(
    (mergeFn: MergeFn<S>) => mergeTypedCache(cacheName, mergeFn),
    [cacheName, mergeTypedCache]
  );
  const clearCache = useCallback(() => clearTypedCache(cacheName), [cacheName, clearTypedCache]);
  const cacheContains = useCallback(() => typedCacheContains(cacheName), [cacheName, typedCacheContains]);

  return { getCache, setCache, mergeCache, clearCache, cacheContains };
}
