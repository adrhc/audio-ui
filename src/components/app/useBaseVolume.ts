import { useCallback } from 'react';
import useRefEx from '../../hooks/useRefEx';
import { NullOrUndefined } from '../../domain/types';

export type UseBaseVolumeResult = [
  () => NullOrUndefined<number>,
  (value: NullOrUndefined<number>) => void,
  (increment: number) => void,
];

export function useBaseVolume(): UseBaseVolumeResult {
  const [getBaseVolume, setBaseVolume] = useRefEx<number>();

  /* const setBaseVolume = useCallback(
    (newValue: number | null | undefined) => {
      const currentValue = getBaseVolume();
      const newBaseVolume = newValue != null ? Math.max(0, Math.min(100, newValue)) : null;
      console.info(
        `[setBaseVolume] oldBaseVolume = ${currentValue}, newBaseVolume = ${newBaseVolume}, user asked for ${newValue}`
      );
      setBaseVolumeFn(newBaseVolume);
    },
    [getBaseVolume, setBaseVolumeFn]
  ); */

  const incrementBaseVolume = useCallback(
    (increment: number) => {
      const baseVolume = getBaseVolume();
      console.info(`[setBaseVolume] baseVolume = ${baseVolume ?? 'null'}, increment = ${increment}!`);
      if (baseVolume != null) {
        const newBaseVolume = baseVolume + increment;
        console.info(`[setBaseVolume] oldBaseVolume = ${baseVolume}, newBaseVolume = ${newBaseVolume}`);
        setBaseVolume(newBaseVolume);
      }
    },
    [getBaseVolume, setBaseVolume]
  );

  return [getBaseVolume, setBaseVolume, incrementBaseVolume];
}
