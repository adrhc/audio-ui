import { Button, Stack, TextField } from '@mui/material';
import ConfirmationButtonMenu from '../../components/menu/ConfirmationButtonMenu';
import { useSustainableState } from '../../hooks/useSustainableState';
import { SetFeedbackState } from '../../lib/sustain/types';
import PageTemplate from '../../templates/PageTemplate';
import { useGoBack } from '../../hooks/useGoBack';
import useButtonRef from '../../hooks/useButtonRef';
import { useCallback } from 'react';
import { FileNameAndContent, updateContent } from '../../infrastructure/files/files';
import { useParams } from 'react-router-dom';
import useFormEditor from '../../hooks/useFormEditor';
import './RemoteFileEditorPage.scss';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';

export default function RemoteFileEditorPage() {
  const { filename } = useParams();
  const goBack = useGoBack();
  const [submitBtnRef, submitBtnClick] = useButtonRef();
  const [state, sustain, setState] = useSustainableState<FileNameAndContent>({
    filename: filename ?? '',
    content: '',
  });

  const { handleTextElementChange } = useFormEditor(setState);

  const handleSubmit = useCallback(() => {
    setState((old) => ({ ...old, error: '' }));
    sustain(updateContent(state).then(goBack), { ...state, error: 'Update failed!' });
  }, [goBack, setState, state, sustain]);

  const maxRows = useBreakpointValue(15, 20, 25);
  console.log(`[RemoteFileEditorPage] maxRows:`, maxRows);

  return (
    <PageTemplate
      className='file-editor-page'
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<ConfirmationButtonMenu onAccept={submitBtnClick} />}
      title={filename}
      widePage={true}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          className="file-content"
          required
          multiline
          maxRows={maxRows}
          inputProps={{ minLength: 3 }}
          onChange={handleTextElementChange}
          name="content"
          value={state.content}
        />
        <Button ref={submitBtnRef} type="submit" sx={{ display: 'none' }} />
      </Stack>
    </PageTemplate>
  );
}
