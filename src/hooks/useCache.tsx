import { useCallback, useRef } from 'react';

type Cache = {
  [key: string]: unknown;
};

export type GetCacheFn = (key: string) => unknown;
export type SetCacheFn = (key: string, value: unknown) => void;
export type MergeCacheFn = (key: string, mergeFn: (oldValue: unknown) => unknown) => void;
export type ClearCacheFn = (key: string) => void;
export type CacheContainsFn = (key: string) => boolean;

export interface CacheOperations {
  getCache: GetCacheFn;
  setCache: SetCacheFn;
  mergeCache: MergeCacheFn;
  clearCache: ClearCacheFn;
  cacheContains: CacheContainsFn;
}

export function useCache(): CacheOperations {
  const ref = useRef<Cache>({});
  const cacheContains = useCallback((key: string) => ref.current[key] == null, [ref]);
  const getCache = useCallback((key: string) => ref.current[key], [ref]);
  const setCache = useCallback(
    (key: string, value: unknown) => {
      ref.current[key] = value;
      // console.log(`set cache for ${key}:`, value);
    },
    [ref]
  );
  const mergeCache = useCallback(
    (key: string, mergeFn: (oldValue: unknown) => unknown) => {
      // const oldCache = ref.current[key];
      // const newCache = mergeFn(ref.current[key]);
      // console.log(`merge ${key}, scrollTop: old = ${oldCache?.scrollTop}, new = ${newCache?.scrollTop}`);
      // console.log(`merge cache for ${key}:`, { oldCache, newCache });
      ref.current[key] = mergeFn(ref.current[key]);
    },
    [ref]
  );
  const clearCache = useCallback(
    (key: string) => {
      delete ref.current[key];
    },
    [ref]
  );
  return { getCache, setCache, mergeCache, clearCache, cacheContains };
}
