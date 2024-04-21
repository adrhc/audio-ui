import { Box } from '@mui/material';
import { NoArgsProc, Styles } from '../../../lib/types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { ReactNode } from 'react';
import { toArray } from '../../../lib/array';

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
      className={`${styles.cornerButton} ${styles[position]} ${className ?? ''}`}
      sx={[position == 'right' ? { right: 0 } : { left: 0 }, ...toArray(sx)]}
      onClick={handleClick}
    >
      <Box className={styles.iconBox}>{children}</Box>
    </Box>
  );
};

export default CornerIconButton;
