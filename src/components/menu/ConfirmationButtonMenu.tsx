import { Button } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../app/AppContext';
import DoneIcon from '@mui/icons-material/Done';
import BackButtonMenu, { BackButtonMenuParam } from './BackButtonMenu';

export interface ConfirmationButtonMenuParam extends BackButtonMenuParam {
  onAccept: () => void;
  acceptDisabled?: boolean | null;
}

function ConfirmationButtonMenu({ goBack, onAccept, acceptDisabled, children }: ConfirmationButtonMenuParam) {
  const { online } = useContext(AppContext);

  return (
    <BackButtonMenu goBack={goBack}>
      {children}
      <Button disabled={acceptDisabled ?? !online} variant="outlined" onClick={onAccept}>
        {/* <img src="btn/check-mark-circle-line-icon.svg" /> */}
        <DoneIcon />
      </Button>
    </BackButtonMenu>
  );
}

export default ConfirmationButtonMenu;
