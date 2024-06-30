import { useCallback, useRef } from 'react';

type Cache = {
  [key: string]: unknown;
};

export type GetCacheFn = (key: string) => unknown;
export type SetCacheFn = (key: string, value: unknown) => void;
export type MergeCacheFn = (key: string, mergeFn: (oldValue: unknown) => unknown) => void;
export type ClearCacheFn = (key: string) => void;
export type CacheContainsFn = (key: string) => boolean;

export function useCache(): [GetCacheFn, SetCacheFn, MergeCacheFn, ClearCacheFn, CacheContainsFn] {
  const ref = useRef<Cache>({});
  const contains = useCallback((key: string) => ref.current[key] == null, [ref]);
  const getValue = useCallback((key: string) => ref.current[key], [ref]);
  const setValue = useCallback(
    (key: string, value: unknown) => {
      ref.current[key] = value;
      // console.log(`set cache for ${key}:`, value);
    },
    [ref]
  );
  const mergeValue = useCallback(
    (key: string, mergeFn: (oldValue: unknown) => unknown) => {
      // const oldCache = ref.current[key];
      // const newCache = mergeFn(ref.current[key]);
      // console.log(`merge ${key}, scrollTop: old = ${oldCache?.scrollTop}, new = ${newCache?.scrollTop}`);
      // console.log(`merge cache for ${key}:`, { oldCache, newCache });
      ref.current[key] = mergeFn(ref.current[key]);
    },
    [ref]
  );
  const clear = useCallback(
    (key: string) => {
      delete ref.current[key];
    },
    [ref]
  );
  return [getValue, setValue, mergeValue, clear, contains];
}
