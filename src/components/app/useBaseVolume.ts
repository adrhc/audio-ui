import { useCallback } from 'react';
import useRefEx from '../../hooks/useRefEx';
import { NullOrUndefined } from '../../domain/types';
import { truncateVolume } from '../../services/mpc';

export type UseBaseVolumeResult = [
  () => NullOrUndefined<number>,
  (defaultIfNull: number) => number,
  (value: NullOrUndefined<number>) => void,
  (increment: number) => void,
];

export function useBaseVolume(): UseBaseVolumeResult {
  const [getBaseVolume, setRawBaseVolume] = useRefEx<number>();

  const getBaseVolumeOr = useCallback(
    (defaultIfNull: number) => {
      return getBaseVolume() ?? defaultIfNull;
    },
    [getBaseVolume]
  );

  const setBaseVolume = useCallback(
    (rawBaseVolume?: number | null) => {
      const newBaseVolume = truncateVolume(rawBaseVolume);
      console.log(`[setBaseVolume] old = ${getBaseVolume() ?? 'undefined'}, new = ${newBaseVolume}`);
      setRawBaseVolume(newBaseVolume);
    },
    [getBaseVolume, setRawBaseVolume]
  );

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

  return [getBaseVolume, getBaseVolumeOr, setBaseVolume, incrementBaseVolume];
}
