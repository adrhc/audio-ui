import { IconButton } from '@mui/material';
import { NoArgsProc } from '../../domain/types';

const CustomIconButton = ({
  src,
  onClick,
  size,
  className,
}: {
  src: string;
  onClick: NoArgsProc;
  size?: number;
  className?: string;
}) => {
  return (
    <IconButton className={className} onClick={onClick}>
      <img width={size} height={size} src={src} />
    </IconButton>
  );
};

export default CustomIconButton;
