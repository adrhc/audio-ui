import { Alert, AlertColor } from '@mui/material';
import { NoArgsProc } from '../../domain/types';

const CloseableAlert = ({
  className,
  severity = 'error',
  message,
  onClose,
}: {
  className?: string;
  severity?: AlertColor;
  message?: string | null;
  onClose: NoArgsProc;
}) => {
  if (message) {
    return (
      <Alert className={className} severity={severity} onClose={onClose}>
        {new Date().toLocaleTimeString()} {message}
      </Alert>
    );
  } else {
    return <></>;
  }
};

export default CloseableAlert;
