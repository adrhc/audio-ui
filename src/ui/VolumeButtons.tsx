import { ButtonGroup, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { iconFontSize } from './VolumePage-styles';
import { Styles } from '../lib/types';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';

export type VolumeButtonsParam = {
  disabled?: boolean;
  volume: number;
  handleExactVolume: (v: number) => void;
};

export default function VolumeButtons({ disabled, volume, handleExactVolume }: VolumeButtonsParam) {
  function doHandleExactVolume(volume: number) {
    if (volume >= 0 && volume <= 100) {
      handleExactVolume(volume);
    } else {
      console.warn(`[VolumeButtons:doHandleExactVolume] bad volume = ${volume}!`);
    }
  }

  const btnStyle: Styles = {
    flexGrow: 1,
    color: 'black',
    fontSize: iconFontSize,
  };

  return (
    <ButtonGroup>
      <Button
        disabled={disabled}
        variant="outlined"
        // size="small"
        sx={btnStyle}
        onClick={() => doHandleExactVolume(Math.max(0, volume - 5))}
      >
        <Looks5RoundedIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        // size="large"
        sx={btnStyle}
        onClick={() => doHandleExactVolume(volume - 1)}
      >
        <RemoveIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        // size="large"
        sx={btnStyle}
        onClick={() => doHandleExactVolume(volume + 1)}
      >
        <AddIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        // size="small"
        sx={btnStyle}
        onClick={() => doHandleExactVolume(Math.min(100, volume + 5))}
      >
        <Looks5RoundedIcon sx={{ fontSize: iconFontSize }} />
      </Button>
    </ButtonGroup>
  );
}
