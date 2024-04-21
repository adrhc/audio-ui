import { Box } from '@mui/material';
import { NoArgsProc, Styles } from '../../../lib/types';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

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
      className={`${styles.cornerButton} ${styles[position ?? 'left']} ${className}`}
      sx={sx}
      onClick={handleClick}
    ></Box>
  );
};

export default CornerButton;
