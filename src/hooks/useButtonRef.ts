import { useCallback, useRef } from 'react';

export type CLICK = () => void;

export default function useButtonRef(): [React.RefObject<HTMLButtonElement | null>, CLICK] {
  const btnRef = useRef<HTMLButtonElement>(null);
  const click = useCallback(() => btnRef.current?.click(), [btnRef]);
  return [btnRef, click];
}
