import { Stack, Button, ButtonBase } from '@mui/material';
import { inputFontSize } from './VolumePage-styles';
import { Styles } from '../lib/types';

export type ExactVolumePanelParam = {
  disabled: boolean;
  volume: number;
  exactVolume?: number;
  setExactVolume?: (volume: number) => void;
  handleExactVolume: (volume: number) => void;
};

const ExactVolumePanel = ({ disabled, volume, handleExactVolume }: ExactVolumePanelParam) => {
  const btnStyle: Styles = { fontSize: inputFontSize, minWidth: 'auto', flexGrow: 1, p: 0 };
  return (
    <Stack spacing={1} direction="row" sx={{ justifyContent: 'center' }}>
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(5)}>
        5
      </Button>
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(10)}>
        10
      </Button>
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(15)}>
        15
      </Button>
      <ButtonBase
        sx={{
          ...btnStyle,
          fontWeight: 'bold',
          cursor: 'auto',
          border: 'thin solid rgba(25, 118, 210, 0.5)',
          borderRadius: 1,
        }}
        disabled={disabled}
      >
        {volume}
      </ButtonBase>
      {/* <Box sx={[{display: 'flex', alignItems: 'center'}]}>
        <Typography noWrap={true} fontSize={inputFontSize} fontWeight="bold">
          {volume}
        </Typography>
      </Box> */}
      {/* <ExactVolume
        disabled={disabled}
        exactVolume={exactVolume}
        setExactVolume={setExactVolume}
        handleExactVolume={handleExactVolume}
      /> */}
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(25)}>
        25
      </Button>
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(75)}>
        75
      </Button>
      <Button sx={btnStyle} disabled={disabled} variant="outlined" onClick={() => handleExactVolume(85)}>
        85
      </Button>
    </Stack>
  );
};

export default ExactVolumePanel;
