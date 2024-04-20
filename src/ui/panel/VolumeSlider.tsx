import { VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack, Tooltip, debounce } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import MuteIconButton from '../button/MuteIconButton';
import { NoArgsProc } from '../../lib/types';
import { BORDER, iconFontSizeMap } from '../../pages/volume/styles';

const fontSizeMapper = (ifs: number[]) => ifs.map((fs, i) => fs + (i == 0 ? 0.5 : 0));
const muteBtnFontSizeMapper = (ifs: number[]) => fontSizeMapper(ifs).map((s) => s + 0.375);

export type VolumeSliderParam = {
  disabled?: boolean;
  mute: boolean;
  volume: number;
  onMute: NoArgsProc;
  onSlide: (volume: number) => void;
};

const VolumeSlider = ({ disabled, mute, volume: parentVolume, onMute, onSlide }: VolumeSliderParam) => {
  const [volume, setVolume] = useState(parentVolume);

  useEffect(() => {
    // console.log(`[VolumeSlider:useEffect] volume = ${volume}, parentVolume = ${parentVolume}`);
    setVolume(parentVolume);
  }, [parentVolume]);

  const onSlideFn = useCallback(debounce(onSlide, 150), []);

  function handleChange(volume: number) {
    // console.log(`[VolumeSlider:handleChange] volume = ${volume}, parentVolume = ${parentVolume}`);
    setVolume(volume);
    onSlideFn(volume);
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={BORDER}>
      <MuteIconButton
        disabled={disabled}
        sx={{ '& .MuiSvgIcon-root': { fontSize: iconFontSizeMap(muteBtnFontSizeMapper) } }}
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
        <span>
          <IconButton disabled={disabled} onClick={() => handleChange(100)} sx={{ color: 'black' }}>
            <VolumeUp sx={{ fontSize: iconFontSizeMap(fontSizeMapper) }} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default VolumeSlider;
