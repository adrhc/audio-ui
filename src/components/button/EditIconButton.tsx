import { IconButton } from '@mui/material';
import { NoArgsProc, Styles } from '../../domain/types';

const EditIconButton = ({
  size,
  className,
  sx,
  onClick,
  outline,
  round,
}: {
  size?: number;
  className?: string;
  sx?: Styles;
  onClick: NoArgsProc;
  outline?: boolean;
  round?: boolean;
}) => {
  return (
    <IconButton className={className} onClick={onClick} sx={sx}>
      {round && (
        <img
          width={size}
          height={size}
          src={`edit-btn/${outline ? 'edit-round-line-icon.svg' : 'edit-round-icon.svg'}`}
        />
      )}
      {!round && (
        <img
          width={size}
          height={size}
          src={`edit-btn/${outline ? 'pencil-square-outline-icon.svg' : 'edit-square-icon.svg'}`}
        />
      )}
    </IconButton>
  );
};

export default EditIconButton;
