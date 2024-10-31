import { useParams } from 'react-router-dom';
import { useSustainableState } from '../../hooks/useSustainableState';
import { FileNameAndContent, getByFileName } from '../../infrastructure/files/files';
import { useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import { SetFeedbackState } from '../../lib/sustain/types';
import { Box } from '@mui/material';

export default function RemoteFileViewPage() {
  const { filename } = useParams();
  const [state, sustain, setState] = useSustainableState<FileNameAndContent>({
    filename: filename ?? '',
    content: '',
  });

  useEffect(() => {
    filename && sustain(getByFileName(filename), 'Failed to load the file!');
  }, [filename, sustain]);

  return (
    <PageTemplate
      state={state}
      setState={setState as SetFeedbackState}
      title={filename}
      widePage={true}
    >
      <Box sx={{ overflow: 'auto', flexGrow: 1, fontSize: 'small' }}>{state.content}</Box>
    </PageTemplate>
  );
}
