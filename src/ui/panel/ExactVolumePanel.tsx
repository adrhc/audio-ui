import { Stack, Button } from '@mui/material';
import { inputFontSize } from '../../pages/volume/styles';

export type ExactVolumePanelParam = {
  disabled: boolean;
  exactVolume?: number;
  setExactVolume?: (volume: number) => void;
  handleExactVolume: (volume: number) => void;
};

export default function ExactVolumePanel({ disabled, handleExactVolume }: ExactVolumePanelParam) {
  return (
    <Stack direction="row" spacing={[0.25, 0.5]} sx={{ justifyContent: 'center' }}>
      {[5, 15, 25, 45, 60, 75].map((volume) => (
        <Button
          key={volume}
          sx={{ fontSize: inputFontSize, minWidth: 'auto', flexGrow: 1, p: 0 }}
          disabled={disabled}
          variant="outlined"
          onClick={() => handleExactVolume(volume)}
        >
          {volume}
        </Button>
      ))}
    </Stack>
  );
}
