import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Slider, Stack } from '@mui/material';

export type VolumeSliderParam = {
  disabled?: boolean;
  sliderVolume: number;
  handleSliderVolume: (v: number) => void;
};

const VolumeSlider = ({ disabled, sliderVolume, handleSliderVolume }: VolumeSliderParam) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <VolumeDown />
      <Slider
        disabled={disabled}
        aria-label="Volume"
        value={sliderVolume}
        onChange={(_e, newValue) => handleSliderVolume(newValue as number)}
      />
      <VolumeUp />
    </Stack>
  );
};

export default VolumeSlider;
