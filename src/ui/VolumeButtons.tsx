import { ButtonGroup, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Styles } from '../lib/types';
import { FONT_SIZE } from './volume-page-styles';

export type VolumeButtonsParam = {
  disabled?: boolean;
  volume: number;
  handleExactVolume: (v: number) => void;
  // btnStyle: {[key: string]: number | string | number[] | string[]};
  btnStyle: Styles;
};

const VolumeButtons = ({ disabled, volume, handleExactVolume, btnStyle }: VolumeButtonsParam) => {
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
        sx={{ ...btnStyle, flexGrow: 1 }}
        onClick={() => doHandleExactVolume(volume - 1)}
      >
        <RemoveCircleIcon sx={{ fontSize: FONT_SIZE.icon }} />
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        size="large"
        sx={{ ...btnStyle, flexGrow: 1 }}
        onClick={() => doHandleExactVolume(volume + 1)}
      >
        <AddCircleIcon sx={{ fontSize: FONT_SIZE.icon }} />
      </Button>
    </ButtonGroup>
  );
};

export default VolumeButtons;
