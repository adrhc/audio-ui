import { useCallback, useRef } from 'react';
import { NullOrUndefined } from '../domain/types';

export default function useRefEx<T>(
  initValue?: T | null
): [() => NullOrUndefined<T>, (t: NullOrUndefined<T>) => void, () => boolean] {
  const ref = useRef<NullOrUndefined<T>>(initValue);
  const isNull = useCallback(() => ref.current == null, [ref]);
  const getValue = useCallback(() => ref.current, [ref]);
  const setValue = useCallback(
    (value: NullOrUndefined<T>) => {
      ref.current = value;
    },
    [ref]
  );
  return [getValue, setValue, isNull];
}
