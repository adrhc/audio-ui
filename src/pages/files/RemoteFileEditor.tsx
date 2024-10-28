import { Button, Stack, TextField } from '@mui/material';
import ConfirmationButtonMenu from '../../components/menu/ConfirmationButtonMenu';
import { useSustainableState } from '../../hooks/useSustainableState';
import { SetFeedbackState } from '../../lib/sustain/types';
import PageTemplate from '../../templates/PageTemplate';
import { useGoBack } from '../../hooks/useGoBack';
import useButtonRef from '../../hooks/useButtonRef';
import { useCallback } from 'react';
import { RemoteFile, updateRemoteFile } from '../../infrastructure/files/files';
import { useParams } from 'react-router-dom';
import useFormEditor from '../../hooks/useFormEditor';

export default function RemoteFileEditor() {
  const { filename } = useParams();
  const goBack = useGoBack();
  const [submitBtnRef, submitBtnClick] = useButtonRef();
  const [state, sustain, setState] = useSustainableState<RemoteFile>({
    filename: filename ?? '',
    content: '',
  });

  const { handleInputElementChange } = useFormEditor(setState);

  const handleSubmit = useCallback(() => {
    setState((old) => ({ ...old, error: '' }));
    sustain(updateRemoteFile(state).then(goBack), { ...state, error: 'Update failed!' });
  }, [goBack, setState, state, sustain]);

  <PageTemplate
    state={state}
    setState={setState as SetFeedbackState}
    bottom={<ConfirmationButtonMenu onAccept={submitBtnClick} />}
    title={filename}
    widePage={true}
  >
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        id="outlined-multiline-static"
        required
        multiline
        rows={10}
        defaultValue=""
        inputProps={{ minLength: 3 }}
        onChange={handleInputElementChange}
        name="content"
        value={state.content}
      />
      <Button ref={submitBtnRef} type="submit" sx={{ display: 'none' }} />
    </Stack>
  </PageTemplate>;
}
