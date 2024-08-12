import { ButtonGroup, Button, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import { iconFontSize } from '../../pages/styles';
import { Styles } from '../../domain/types';
import { useContext } from 'react';
import { AppContext } from '../app/AppContext';
import './VolumeButtonsPanel.scss';

export type VolumeButtonsParam = {
  sx?: Styles;
  badgeColor: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  hideBadge?: boolean;
  volume: number;
  onIncrement: (increment: number) => void;
  useVolumeForBadge?: boolean;
};

export default function VolumeButtonsPanel({
  sx,
  badgeColor,
  disabled,
  hideBadge = false,
  volume,
  onIncrement,
  useVolumeForBadge,
}: VolumeButtonsParam) {
  const { getBaseVolume, online } = useContext(AppContext);
  // console.log(`[VolumeButtons] badgeColor=${badgeColor}, hideBadge=${hideBadge}`);

  // there's no chance for the baseVolume to be changed
  // after reading it here while still in VolumeButtonsPanel
  const baseVolume = getBaseVolume();
  // console.log(`[VolumeButtons] baseVolume=${baseVolume}, volume=${volume}`);

  const badgeContent = useVolumeForBadge ? volume : baseVolume ?? 'unknown';

  const fontSize = iconFontSize((fs) => fs.map((n) => n + 1));

  return (
    <ButtonGroup className="volume-buttons-panel" disabled={disabled ?? !online} sx={sx}>
      <Button variant="outlined" onClick={() => onIncrement(-5)}>
        <Looks5RoundedIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => onIncrement(-1)}>
        <Badge color={badgeColor} badgeContent={badgeContent} showZero={true} invisible={hideBadge}>
          <RemoveIcon sx={{ fontSize }} />
        </Badge>
      </Button>
      <Button variant="outlined" onClick={() => onIncrement(1)}>
        <AddIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => onIncrement(5)}>
        <Looks5RoundedIcon sx={{ fontSize }} />
      </Button>
    </ButtonGroup>
  );
}
