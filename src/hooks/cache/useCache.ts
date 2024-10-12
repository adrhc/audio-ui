import { useCallback, useRef } from 'react';

type Cache<S> = {
  [cacheName: string]: S;
};

export type GetCacheFn<S> = (cacheName: string) => S;
export type SetCacheFn<S> = (cacheName: string, value: S) => void;
export type MergeFn<S> = (oldValue: S) => S;
export type MergeCacheFn<S> = (cacheName: string, mergeFn: MergeFn<S>) => void;
export type ClearCacheFn = (cacheName: string) => void;
export type CacheContainsFn = (cacheName: string) => boolean;

export interface CacheOperations<S> {
  getCache: GetCacheFn<S>;
  setCache: SetCacheFn<S>;
  mergeCache: MergeCacheFn<S>;
  clearCache: ClearCacheFn;
  cacheContains: CacheContainsFn;
}

export interface UnknownCacheTypeOperations extends CacheOperations<unknown> {}

export function useCache(): UnknownCacheTypeOperations {
  return { ...useTypedCache() };
}

export function useTypedCache<S>(): CacheOperations<S> {
  const ref = useRef<Cache<S>>({});
  const cacheContains = useCallback((cacheName: string) => ref.current[cacheName] == null, [ref]);
  // return a copy to avoid subtle errors
  const getCache = useCallback((cacheName: string) => ({ ...ref.current[cacheName] }), [ref]);
  const setCache = useCallback(
    (cacheName: string, value: S) => {
      console.log(`[useTypedCache.setCache] set "${cacheName}" cache to:`, value);
      ref.current[cacheName] = value;
    },
    [ref]
  );
  const mergeCache = useCallback(
    (cacheName: string, mergeFn: (oldValue: S) => S) => {
      // const oldCache = ref.current[cacheName];
      // const newCache = mergeFn(ref.current[cacheName]);
      // console.log(`[useTypedCache.mergeCache] ${cacheName}:`, { oldCache, newCache });
      // console.log(`[useTypedCache.mergeCache] ${cacheName}, new cache:`, newCache);
      // ref.current[cacheName] = newCache;
      ref.current[cacheName] = mergeFn(ref.current[cacheName]);
    },
    [ref]
  );
  const clearCache = useCallback(
    (cacheName: string) => {
      console.log(`[useTypedCache.clearCache] ${cacheName}`);
      delete ref.current[cacheName];
    },
    [ref]
  );
  return { getCache, setCache, mergeCache, clearCache, cacheContains };
}
