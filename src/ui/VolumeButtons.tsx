import { ButtonGroup, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { iconFontSize } from './VolumePage-styles';

export type VolumeButtonsParam = {
  disabled?: boolean;
  volume: number;
  handleExactVolume: (v: number) => void;
};

const VolumeButtons = ({ disabled, volume, handleExactVolume }: VolumeButtonsParam) => {
  function doHandleExactVolume(volume: number) {
    if (volume >= 0 && volume <= 100) {
      handleExactVolume(volume);
    } else {
      console.warn(`[doHandleExactVolume] bad volume = ${volume}!`);
    }
  }

  return (
    <ButtonGroup>
      <Button
        disabled={disabled}
        variant="outlined"
        size="large"
        sx={{ flexGrow: 1 }}
        onClick={() => doHandleExactVolume(volume - 1)}
      >
        <RemoveCircleIcon sx={{ fontSize: iconFontSize }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        size="large"
        sx={{ flexGrow: 1 }}
        onClick={() => doHandleExactVolume(volume + 1)}
      >
        <AddCircleIcon sx={{ fontSize: iconFontSize }} />
      </Button>
    </ButtonGroup>
  );
};

export default VolumeButtons;
