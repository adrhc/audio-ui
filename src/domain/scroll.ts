import { ScrollPosition } from "../hooks/scrollable/useCachedPositionScrollable";

export type ScrollToFn = (top?: number) => void;

export function scrollTop(o: unknown): number {
  return (o as ScrollPosition)?.scrollTop ?? 0;
}
