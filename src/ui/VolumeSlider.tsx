import { VolumeUp } from '@mui/icons-material';
import { Slider, Stack, debounce } from '@mui/material';
import { useCallback } from 'react';
import MuteIconButton from './MuteIconButton';
import { NoParamsProc } from '../lib/types';

export type VolumeSliderParam = {
  disabled?: boolean;
  mute: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  onMute: NoParamsProc;
  onSlide: (volume: number) => void;
  addLog?: (log: string) => void
};

const VolumeSlider = ({ disabled, mute, volume, setVolume, onMute, onSlide, addLog }: VolumeSliderParam) => {
  const onSlideFn = useCallback(debounce(onSlide, 100), []);

  function handleChange(volume: number) {
    setVolume(volume);
    addLog && addLog(`[handleChange] volume = ${volume}`);
    onSlideFn(volume);
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <MuteIconButton mute={mute} onClick={onMute} />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={volume}
        onChange={(_e, newValue) => handleChange(newValue as number)}
      />
      <VolumeUp />
    </Stack>
  );
};

export default VolumeSlider;
