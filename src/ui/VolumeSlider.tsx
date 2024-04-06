import { VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack, debounce } from '@mui/material';
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
  addLog?: (log: string) => void;
};

const VolumeSlider = ({ disabled, mute, volume, setVolume, onMute, onSlide, addLog }: VolumeSliderParam) => {
  const onSlideFn = useCallback(debounce(onSlide, 150), []);

  function handleChange(volume: number) {
    setVolume(volume);
    addLog && addLog(`[handleChange] volume = ${volume}`);
    onSlideFn(volume);
  }

  const spacing = 1;
  const fontSize = [40, 36];

  return (
    <Stack direction="row" spacing={spacing} alignItems="center">
      <MuteIconButton
        styles={{ p: 0, '& .MuiSvgIcon-fontSizeMedium': { fontSize } }}
        mute={mute}
        onClick={onMute}
      />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={volume}
        onChange={(_e, newValue) => handleChange(newValue as number)}
        sx={{ ml: `${spacing * 4}px !important` }}
      />
      <IconButton onClick={() => handleChange(100)}>
        <VolumeUp sx={{ fontSize, color: 'black' }} />
      </IconButton>
    </Stack>
  );
};

export default VolumeSlider;
