import { Stack, Button } from '@mui/material';
import ExactVolume from './ExactVolume';
import { inputFontSize } from './VolumePage-styles';
import { Styles } from '../lib/types';

export type ExactVolumePanelParam = {
  disabled: boolean;
  exactVolume: number;
  setExactVolume: (volume: number) => void;
  handleExactVolume: (volume: number) => void;
};

const ExactVolumePanel = ({
  disabled,
  exactVolume,
  setExactVolume,
  handleExactVolume,
}: ExactVolumePanelParam) => {
  const btnStyle: Styles = { minWidth: 'auto', px: 0.8, fontSize: inputFontSize };
  return (
    <Stack spacing={1} direction="row" sx={{ justifyContent: 'center' }}>
      <Button sx={btnStyle} variant="outlined" onClick={() => handleExactVolume(15)}>
        15
      </Button>
      <Button sx={btnStyle} variant="outlined" onClick={() => handleExactVolume(25)}>
        25
      </Button>
      <ExactVolume
        disabled={disabled}
        exactVolume={exactVolume}
        setExactVolume={setExactVolume}
        handleExactVolume={handleExactVolume}
      />
      <Button sx={btnStyle} variant="outlined" onClick={() => handleExactVolume(75)}>
        75
      </Button>
      <Button sx={btnStyle} variant="outlined" onClick={() => handleExactVolume(85)}>
        85
      </Button>
    </Stack>
  );
};

export default ExactVolumePanel;
