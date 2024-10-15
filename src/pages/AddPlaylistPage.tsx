import { Stack, TextField } from '@mui/material';
import { useSustainableState } from '../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import { AppContext } from '../hooks/AppContext';
import { useGoBack } from '../hooks/useGoBack';
import { SetFeedbackState } from '../lib/sustain';
import ConfirmationPageTmpl from '../templates/ConfirmationPageTmpl';
import useLibrary from '../hooks/useLibrary';

const MIN_PL_NAME_LENGTH = 3;
interface NewPlaylistPageState {
  name: string;
}

function AddPlaylistPage() {
  const goBack = useGoBack();
  const { online } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<NewPlaylistPageState>({ name: '' });
  const { createPlaylist } = useLibrary(sustain);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(`[NewPlaylistPage.handleChange] changed:`, { [name]: value });
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    [setState]
  );

  const trimmedName = state.name.trim();
  const createPlaylistThenGoBack = useCallback(() => {
    createPlaylist(trimmedName).then(goBack);
  }, [createPlaylist, goBack, trimmedName]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createPlaylistThenGoBack();
    },
    [createPlaylistThenGoBack]
  );

  const createBtnDisabled = !online || state.name.length < MIN_PL_NAME_LENGTH;
  return (
    <ConfirmationPageTmpl
      state={state}
      setState={setState as SetFeedbackState}
      title="Create a Playlist"
      onAccept={createPlaylistThenGoBack}
      acceptDisabled={createBtnDisabled}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          autoFocus={true}
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
