import { ButtonGroup, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TuneIcon from '@mui/icons-material/Tune';
import { iconFontSize, iconFontSizeMap } from './VolumePage-styles';
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

  const btn5FontSize = iconFontSizeMap((fs) => fs.map((fs) => fs - 1));
  const btn5Style: Styles = {
    flexGrow: 1,
    color: 'black',
    fontSize: btn5FontSize,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  };

  return (
    <ButtonGroup>
      <Button
        disabled={disabled}
        variant="outlined"
        size="small"
        sx={btn5Style}
        onClick={() => doHandleExactVolume(Math.max(0, volume - 5))}
      >
        {/* <Chip label="-5" /> */}
        <Looks5RoundedIcon sx={{ fontSize: btn5FontSize }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        size="large"
        sx={{ flexGrow: 2 }}
        onClick={() => doHandleExactVolume(volume - 1)}
      >
        <RemoveIcon sx={{ fontSize: iconFontSize, color: 'black' }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        size="large"
        sx={{ flexGrow: 2 }}
        onClick={() => doHandleExactVolume(volume + 1)}
      >
        <AddIcon sx={{ fontSize: iconFontSize, color: 'black' }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        size="small"
        sx={btn5Style}
        onClick={() => doHandleExactVolume(Math.min(100, volume + 5))}
      >
        <Looks5RoundedIcon sx={{ fontSize: btn5FontSize }} />
      </Button>
    </ButtonGroup>
  );
}
