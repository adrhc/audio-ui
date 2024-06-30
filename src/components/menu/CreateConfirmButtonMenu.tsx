import ConfirmationButtonMenu, { ConfirmationButtonMenuParam } from './ConfirmationButtonMenu';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../app/AppContext';
import AddIcon from '@mui/icons-material/Add';

interface CreateConfirmButtonMenuParam extends ConfirmationButtonMenuParam {
  addPage?: string;
  onAdd?: () => void;
  addDisabled?: boolean;
}

function CreateConfirmButtonMenu({
  goBack,
  onAccept,
  acceptDisabled,
  addPage,
  onAdd,
  addDisabled,
}: CreateConfirmButtonMenuParam) {
  const { online } = useContext(AppContext);

  return (
    <ConfirmationButtonMenu goBack={goBack} onAccept={onAccept} acceptDisabled={acceptDisabled}>
      {addPage && (
        <Button variant="outlined" component={Link} to={addPage}>
          <AddIcon />
        </Button>
      )}
      {onAdd && (
        <Button disabled={addDisabled ?? !online} variant="outlined" onClick={onAdd}>
          <AddIcon />
        </Button>
      )}
    </ConfirmationButtonMenu>
  );
}

export default CreateConfirmButtonMenu;
