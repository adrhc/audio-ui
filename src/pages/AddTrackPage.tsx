import { Stack, TextField } from '@mui/material';
import { SetFeedbackState } from '../lib/sustain/types';
import ConfirmationPageTmpl from '../templates/ConfirmationPageTmpl';
import { useCallback, useContext } from 'react';
import { AppContext } from '../hooks/AppContext';
import { useGoBack } from '../hooks/useGoBack';
import { useSustainableState } from '../hooks/useSustainableState';
import { addUrisThenPlay } from '../infrastructure/mopidy/playing-list/add-song';

const MIN_URI_LENGTH = 3;
interface AddTrackPageState {
  uri: string;
}

function AddTrackPage() {
  const goBack = useGoBack();
  const { mopidy, online } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<AddTrackPageState>({ uri: '' });

  const trimmedUri = state.uri.trim();
  const addTrack = useCallback(() => {
    sustain(addUrisThenPlay(mopidy, trimmedUri).then(goBack), `Failed to add ${trimmedUri}!`);
  }, [goBack, mopidy, sustain, trimmedUri]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    [setState]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addTrack();
    },
    [addTrack]
  );

  const addBtnDisabled = !online || state.uri.length < MIN_URI_LENGTH;
  return (
    <ConfirmationPageTmpl
      state={state}
      setState={setState as SetFeedbackState}
      title="Add a Track"
      onAccept={addTrack}
      acceptDisabled={addBtnDisabled}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          required
          label="Track"
          name="uri"
          inputProps={{ minLength: MIN_URI_LENGTH }}
          value={state.uri}
          onChange={handleChange}
        />
      </Stack>
    </ConfirmationPageTmpl>
  );
}

export default AddTrackPage;
