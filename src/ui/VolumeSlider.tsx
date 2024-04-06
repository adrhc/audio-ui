import { VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack, Tooltip, debounce } from '@mui/material';
import { useCallback } from 'react';
import MuteIconButton from './MuteIconButton';
import { NoParamsProc, Styles } from '../lib/types';
import { FONT_SIZE } from './volume-page-styles';

const spacing = 1;
const fontSize = FONT_SIZE.icon.map((n, i) => n + (i == 0 ? 4 : 0)); // [40, 36];

type SX_KEYS = 'muteBtn' | 'slider' | 'upIcon';
const SX: Partial<Record<SX_KEYS, Styles>> = {
  muteBtn: { '& .MuiSvgIcon-fontSizeMedium': { fontSize: fontSize.map((s) => s + 3) } },
  upIcon: { fontSize, color: 'black' },
};

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

  return (
    <Stack direction="row" spacing={spacing} alignItems="center">
      <MuteIconButton styles={SX.muteBtn} mute={mute} onClick={onMute} />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={volume}
        onChange={(_e, newValue) => handleChange(newValue as number)}
        sx={SX.slider}
      />
      <Tooltip title="Set the volume to 100">
        <IconButton onClick={() => handleChange(100)}>
          <VolumeUp sx={SX.upIcon} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default VolumeSlider;
