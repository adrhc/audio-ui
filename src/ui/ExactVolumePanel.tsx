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

const btnStyle: Styles = { fontSize: inputFontSize, minWidth: 'auto', flexGrow: 1, p: 0 };
const volumes = [5, 15, 25, 45, 60, 75];

export default function ExactVolumePanel({ disabled, volume, handleExactVolume }: ExactVolumePanelParam) {
  return (
    <Stack spacing={[0.5, 1]} direction="row" sx={{ justifyContent: 'center' }}>
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[0])}
      >
        {volumes[0]}
      </Button>
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[1])}
      >
        {volumes[1]}
      </Button>
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[2])}
      >
        {volumes[2]}
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
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[3])}
      >
        {volumes[3]}
      </Button>
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[4])}
      >
        {volumes[4]}
      </Button>
      <Button
        sx={btnStyle}
        disabled={disabled}
        variant="outlined"
        onClick={() => handleExactVolume(volumes[5])}
      >
        {volumes[5]}
      </Button>
    </Stack>
  );
}
