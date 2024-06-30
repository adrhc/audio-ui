export type ScrollToFn = (top?: number) => void;

export type ScrollPosition = {
  scrollTop?: number | null;
};

export function scrollTop(o: unknown) {
  return (o as ScrollPosition)?.scrollTop;
}
