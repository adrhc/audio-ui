import { useNavigate } from 'react-router-dom';
import { useSustainableState } from '../../hooks/useSustainableState';
import { SetFeedbackState } from '../../lib/sustain/types';
import PageTemplate from '../../templates/PageTemplate';
import { useCallback, useEffect } from 'react';
import { getFileNames } from '../../infrastructure/files/files';
import CRUDList from './CRUDList';

interface RemoteFileToEditSelectorPageState {
  files: string[];
}

export default function RemoteFileToEditSelectorPage() {
  const navigate = useNavigate();
  const [state, sustain, setState] = useSustainableState<RemoteFileToEditSelectorPageState>({ files: [] });

  useEffect(() => {
    sustain(
      getFileNames().then((files) => ({ files })),
      'Failed to load the file names!'
    );
  }, [sustain]);

  const handleEdit = useCallback(
    (filename: string) => {
      console.log(`[handleEdit] filename:`, filename);
      navigate(`edit/${filename}`);
    },
    [navigate]
  );

  const handleView = useCallback(
    (filename: string) => {
      console.log(`[handleView] filename:`, filename);
      navigate(`view/${filename}`);
    },
    [navigate]
  );

  return (
    <PageTemplate
      state={state}
      setState={setState as SetFeedbackState}
      title={'Remote Files'}
      disableSpinner={true}
      widePage={true}
    >
      <CRUDList
        loading={state.loading}
        elements={state.files}
        onView={handleView}
        onEdit={handleEdit}
        onSelection={handleView}
      />
    </PageTemplate>
  );
}
