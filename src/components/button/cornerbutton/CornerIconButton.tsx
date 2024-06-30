import { Box } from '@mui/material';
import { NoArgsProc, Styles } from '../../../domain/types';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { toArray } from '../../../lib/array';
import './CornerIconButton.scss';

type CornerIconButtonParam = {
  className?: string;
  sx?: Styles;
  sxIcon?: Styles;
  position?: 'left' | 'right';
  onClick?: NoArgsProc;
  to?: string;
  children: ReactNode;
};

const CornerIconButton = ({
  className,
  sx,
  position = 'left',
  onClick,
  to,
  children,
}: CornerIconButtonParam) => {
  const navigate = useNavigate();

  function handleClick() {
    if (onClick) {
      // console.log(`[CornerIconButton] onClick`);
      onClick();
    } else if (to != null) {
      // console.log(`[CornerIconButton] to=${to}`);
      navigate(to);
    }
  }

  return (
    <Box
      className={`corner-button ${position} ${className ?? ''}`}
      sx={[position == 'right' ? { right: 0 } : { left: 0 }, ...toArray(sx)]}
      onClick={handleClick}
    >
      <Box className="icon-box">{children}</Box>
    </Box>
  );
};

export default CornerIconButton;
