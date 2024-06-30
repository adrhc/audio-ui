import { Button } from '@mui/material';
import { useGoBack } from '../../hooks/useGoBack';
import { NoArgsProc } from '../../domain/types';
import ButtonGroupMenu, { ButtonGroupMenuParam } from './ButtonGroupMenu';
import './BackButtonMenu.scss';

export interface BackButtonMenuParam extends ButtonGroupMenuParam {
  goBack?: NoArgsProc;
  backAtRight?: boolean;
}

function BackButtonMenu({ goBack, children, backAtRight }: BackButtonMenuParam) {
  const goBackFn = useGoBack();

  return (
    <ButtonGroupMenu>
      {backAtRight && children}
      <Button className="back-btn" variant="outlined" onClick={goBack ?? goBackFn}>
        <div className="btn-img-wrapper">
          <img src="btn/turn-left-arrow-icon.svg" />
        </div>
      </Button>
      {!backAtRight && children}
    </ButtonGroupMenu>
  );
}

export default BackButtonMenu;
