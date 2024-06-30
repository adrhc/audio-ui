import { ButtonGroup, Button, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import { iconFontSize } from '../../pages/styles';
import { Styles } from '../../domain/types';
import './VolumeButtonsPanel.scss';

export type VolumeButtonsParam = {
  sx?: Styles;
  badgeColor: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  hideBadge?: boolean;
  volume: number;
  onChange: (v: number) => void;
};

export default function VolumeButtonsPanel({
  sx,
  badgeColor,
  disabled,
  hideBadge = false,
  volume,
  onChange,
}: VolumeButtonsParam) {
  // console.log(`[VolumeButtons] badgeColor=${badgeColor}, hideBadge=${hideBadge}`);

  function doHandleExactVolume(volume: number) {
    if (volume >= 0 && volume <= 100) {
      onChange(volume);
    } else {
      console.warn(`[VolumeButtons:doHandleExactVolume] bad volume = ${volume}!`);
    }
  }

  const fontSize = iconFontSize(fs => fs.map(n => n + 1));

  return (
    <ButtonGroup className="volume-buttons-panel" disabled={disabled} sx={sx}>
      <Button variant="outlined" onClick={() => doHandleExactVolume(Math.max(0, volume - 5))}>
        <Looks5RoundedIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => doHandleExactVolume(volume - 1)}>
        <Badge color={badgeColor} badgeContent={volume} invisible={hideBadge}>
          <RemoveIcon sx={{ fontSize }} />
        </Badge>
      </Button>
      <Button variant="outlined" onClick={() => doHandleExactVolume(volume + 1)}>
        <AddIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => doHandleExactVolume(Math.min(100, volume + 5))}>
        <Looks5RoundedIcon sx={{ fontSize }} />
      </Button>
    </ButtonGroup>
  );
}
