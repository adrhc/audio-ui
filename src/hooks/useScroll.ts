import { RefObject, useCallback, useRef } from 'react';
import { ScrollToFn } from '../domain/scroll';

export default function useScroll<T extends Element>(): [ScrollToFn, RefObject<T>] {
  const listRef = useRef<T>(null);

  const scrollTo = useCallback((top?: number) => listRef.current?.scrollTo({ top: top ?? 0 }), []);

  return [scrollTo, listRef];
}
