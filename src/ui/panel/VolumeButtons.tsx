import { ButtonGroup, Button, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import { iconFontSize } from '../../pages/volume/styles';
import { Styles } from '../../lib/types';

export type VolumeButtonsParam = {
  sx?: Styles;
  badgeColor?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  showVolume?: boolean;
  volume: number;
  handleExactVolume: (v: number) => void;
};

export default function VolumeButtons({
  sx,
  badgeColor,
  disabled,
  showVolume,
  volume,
  handleExactVolume,
}: VolumeButtonsParam) {
  // console.log(`[VolumeButtons] badgeColor=${badgeColor}, showVolume=${showVolume}`);

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
    <ButtonGroup disabled={disabled} sx={sx}>
      <Button variant="outlined" sx={btnStyle} onClick={() => doHandleExactVolume(Math.max(0, volume - 5))}>
        <Looks5RoundedIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button variant="outlined" sx={btnStyle} onClick={() => doHandleExactVolume(volume - 1)}>
        <Badge
          color={badgeColor}
          badgeContent={volume}
          invisible={badgeColor == null && showVolume != null && !showVolume}
        >
          <RemoveIcon sx={{ fontSize: iconFontSize }} />
        </Badge>
      </Button>
      <Button variant="outlined" sx={btnStyle} onClick={() => doHandleExactVolume(volume + 1)}>
        <AddIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button variant="outlined" sx={btnStyle} onClick={() => doHandleExactVolume(Math.min(100, volume + 5))}>
        <Looks5RoundedIcon sx={{ fontSize: iconFontSize }} />
      </Button>
    </ButtonGroup>
  );
}
