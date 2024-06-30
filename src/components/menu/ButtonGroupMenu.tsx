import { ButtonGroup } from '@mui/material';
import { ReactNode } from 'react';
import './BottomPageMenu.scss';

export interface ButtonGroupMenuParam {
  children?: ReactNode;
}

function ButtonGroupMenu({ children }: ButtonGroupMenuParam) {
  return <ButtonGroup className="button-group-menu">{children}</ButtonGroup>;
}

export default ButtonGroupMenu;
