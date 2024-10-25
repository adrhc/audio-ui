import { Button, Stack, TextField } from '@mui/material';
import { EEPreset } from '../../infrastructure/easyeffects';
import { LoadingState, SetLoadingState } from '../../lib/sustain';
import { NoArgsProc } from '../../domain/types';
import { useCallback } from 'react';

interface PresetEditFormParam {
  state: LoadingState<EEPreset>;
  setState: SetLoadingState<EEPreset>;
  submitBtnRef: React.RefObject<HTMLButtonElement>;
  onSubmit: NoArgsProc;
}

const PresetEditForm = ({ state, setState, submitBtnRef, onSubmit }: PresetEditFormParam) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(`[PresetEditForm.handleChange] changed:`, { [name]: value });
      setState((prevState) => ({ ...prevState, [name]: +value }));
    },
    [setState]
  );

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      // console.log(`[PresetEditForm.handleSubmit]`);
      event?.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        type="number"
        label="Amount"
        name="amount"
        value={state.amount}
        onChange={handleChange}
        inputProps={{ min: 0, max: 100, step: 0.1 }}
      />
      <TextField
        type="number"
        label="Blend"
        name="blend"
        value={state.blend}
        onChange={handleChange}
        inputProps={{ min: -10, max: 10, step: 1 }}
      />
      <TextField
        type="number"
        label="Harmonics"
        name="harmonics"
        value={state.harmonics}
        onChange={handleChange}
        inputProps={{ min: 0, max: 100, step: 0.1 }}
      />
      <Stack direction="row" spacing={2} sx={{ '& > div': { flexGrow: 1 } }}>
        <TextField
          type="number"
          label="From frequency"
          name="floor"
          value={state.floor}
          onChange={handleChange}
          inputProps={{ min: 0, max: 100 }}
        />
        <TextField
          type="number"
          label="To frequency"
          name="scope"
          value={state.scope}
          onChange={handleChange}
          inputProps={{ min: 100, max: 500 }}
        />
      </Stack>
      <Button ref={submitBtnRef} type="submit" sx={{ display: 'none' }} />
    </Stack>
  );
};

export default PresetEditForm;
