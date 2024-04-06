import { VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack, Tooltip, debounce } from '@mui/material';
import { useCallback } from 'react';
import MuteIconButton from './MuteIconButton';
import { NoParamsProc } from '../lib/types';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';

const fontSizeMapper = (ifs: number[]) => ifs.map((fs, i) => fs + (i == 0 ? 0.5 : 0));
const muteBtnFontSizeMapper = (ifs: number[]) => fontSizeMapper(ifs).map((s) => s + 0.375);

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
    <Stack direction="row" spacing={1} alignItems="center" sx={BORDER}>
      <MuteIconButton
        styles={{ '& .MuiSvgIcon-root': { fontSize: iconFontSizeMap(muteBtnFontSizeMapper) } }}
        mute={mute}
        onClick={onMute}
      />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={volume}
        onChange={(_e, newValue) => handleChange(newValue as number)}
      />
      <Tooltip title="Set the volume to 100">
        <IconButton onClick={() => handleChange(100)}>
          <VolumeUp sx={{ fontSize: iconFontSizeMap(fontSizeMapper), color: 'black' }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default VolumeSlider;
