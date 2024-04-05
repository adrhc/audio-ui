import { VolumeUp } from '@mui/icons-material';
import { Slider, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import MuteIconButton from './MuteIconButton';
import { NoParamsProc } from '../lib/types';

export type VolumeSliderParam = {
  disabled?: boolean;
  mute: boolean;
  volume: number;
  onMute: NoParamsProc;
  onSlide: (volume: number) => void;
};

const VolumeSlider = ({ disabled, mute, volume, onMute, onSlide }: VolumeSliderParam) => {
  const onSlideFn = useCallback(debounce(onSlide, 300), []);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <MuteIconButton mute={mute} onClick={onMute} />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={volume}
        onChange={(_e, newValue) => onSlideFn(newValue as number)}
      />
      <VolumeUp />
    </Stack>
  );
};

export default VolumeSlider;
