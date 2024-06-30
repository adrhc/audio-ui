import { Box } from '@mui/material';
import { NoArgsProc, Styles } from '../../../domain/types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { toArray } from '../../../lib/array';

type CornerButtonParam = {
  className?: string;
  sx?: Styles;
  position?: 'left' | 'right';
  onClick?: NoArgsProc;
  to?: string;
};

const CornerButton = ({ className, sx, position, onClick, to }: CornerButtonParam) => {
  const navigate = useNavigate();

  function handleClick() {
    if (onClick) {
      // console.log(`[CornerButton] onClick`);
      onClick();
    } else if (to != null) {
      // console.log(`[CornerButton] to=${to}`);
      navigate(to);
    }
  }

  return (
    <Box
      className={`${styles.cornerButton} ${styles[position ?? 'left']} ${className ?? ''}`}
      sx={[position == 'right' ? { right: 0 } : { left: 0 }, ...toArray(sx)]}
      onClick={handleClick}
    />
  );
};

export default CornerButton;
