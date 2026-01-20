import { ScrollPosition } from "../hooks/scrollable/useCachedPositionScrollable";

export type ListRef = React.RefObject<HTMLUListElement | null>;
export type ScrollToFn = (top?: number) => void;
export type OnScrollFn = (e: React.UIEvent<HTMLUListElement>) => void;

export default interface ScrollableList {
  listRef?: ListRef;
  onScroll?: OnScrollFn;
  scrollTo?: ScrollToFn;
}

export function scrollTop(o: unknown): number {
  return (o as ScrollPosition)?.scrollTop ?? 0;
}
