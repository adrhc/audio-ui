import { Stack, Button } from '@mui/material';
import { inputFontSize } from '../../pages/styles';
import { useContext } from 'react';
import { AppContext } from '../app/AppContext';

export type ExactVolumePanelParam = {
  values: number[];
  disabled?: boolean;
  onChange: (volume: number) => void;
};

export default function ExactVolumePanel({ values, disabled, onChange }: ExactVolumePanelParam) {
  const { online } = useContext(AppContext);
  return (
    <Stack direction="row" spacing={[0.25, 0.5]} sx={{ justifyContent: 'center' }}>
      {values.map((volume) => (
        <Button
          key={volume}
          sx={{ fontSize: inputFontSize(), minWidth: 'auto', flexGrow: 1, p: 0 }}
          disabled={disabled ?? !online}
          variant="outlined"
          onClick={() => onChange(volume)}
        >
          {volume}
        </Button>
      ))}
    </Stack>
  );
}
