import { Stack, TextField } from '@mui/material';
import { LoadingStateOrProvider, useSustainableState } from '../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import { AppContext } from '../components/app/AppContext';
import { createPlaylist } from '../services/audio-ws/audio-ws';
import { useGoBack } from '../hooks/useGoBack';
import { SetFeedbackState } from '../lib/sustain';
import ConfirmationPageTmpl from '../templates/ConfirmationPageTmpl';

const MIN_PL_NAME_LENGTH = 3;
interface NewPlaylistPageState {
  name: string;
}

function AddPlaylistPage() {
  const goBack = useGoBack();
  const { online } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<NewPlaylistPageState>({ name: '' });

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // console.log(`[NewPlaylistPage.handleChange] changed:`, { [name]: value });
    setState((prevState) => ({ ...prevState, [name]: value }));
  }, [setState]);

  const trimmedName = state.name.trim();
  const createPl = useCallback(() => {
    const failMessage = `Failed to create ${trimmedName} playlist!`;
    sustain(
      createPlaylist(trimmedName).then((success) => {
        if (!success) {
          return { error: failMessage } as Partial<LoadingStateOrProvider<NewPlaylistPageState>>;
        } else {
          goBack();
        }
      }),
      failMessage
    );
  }, [goBack, trimmedName, sustain]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createPl();
    },
    [createPl]
  );

  const createBtnDisabled = !online || state.name.length < MIN_PL_NAME_LENGTH;
  return (
    <ConfirmationPageTmpl
      state={state}
      setState={setState as SetFeedbackState}
      title="Create a Playlist"
      onAccept={createPl}
      acceptDisabled={createBtnDisabled}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          required
          label="Name"
          name="name"
          inputProps={{ minLength: MIN_PL_NAME_LENGTH }}
          value={state.name}
          onChange={handleChange}
        />
      </Stack>
    </ConfirmationPageTmpl>
  );
}

export default AddPlaylistPage;
