import { useCallback, useContext } from 'react';
import { truncateVolume } from '../domain/utils';
import { AppContext } from './AppContext';
import { setVolume as setMopidyVolume } from '../infrastructure/mopidy/mpc/player';
import { SustainUnknownVoidFn } from './useSustainableState';

export interface UseMopidyVolumeResult {
  setVolume: (newVolume: number) => void;
}

export default function useMopidyVolume(sustain: SustainUnknownVoidFn): UseMopidyVolumeResult {
  const { mopidy, boost, setBaseVolume } = useContext(AppContext);

  const setVolume = useCallback(
    (newVolume: number) => {
      const newBaseVolume = truncateVolume(newVolume - boost);
      // see "boostedVolume - boost" in audio-web-services too (aka "in java")
      sustain(
        // setMopidyVolume and setBaseVolume truncate to [0,100]
        setMopidyVolume(mopidy, newVolume)?.then(() => {
          console.log(
            `[useMopidyVolume:setVolume] newBaseVolume = ${newBaseVolume}, boost = ${boost}, newVolume = ${newVolume}`
          );
          setBaseVolume(newBaseVolume);
        }),
        `Couldn't set the volume to ${newVolume}!`,
        true
      );
    },
    [boost, mopidy, setBaseVolume, sustain]
  );

  return { setVolume };
}
