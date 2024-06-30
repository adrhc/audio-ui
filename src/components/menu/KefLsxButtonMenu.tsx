import { Button } from '@mui/material';
import BackButtonMenu from './BackButtonMenu';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc } from '../../domain/types';

function KefLsxButtonMenu({ showStop, onStop }: { showStop?: boolean; onStop: NoArgsProc }) {
  return (
    <BackButtonMenu>
      {showStop && (
        <Button variant="outlined" onClick={onStop}>
          <StopIcon />
        </Button>
      )}
    </BackButtonMenu>
  );
}

export default KefLsxButtonMenu;
