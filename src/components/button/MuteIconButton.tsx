import { Button, Theme } from '@mui/material';
import DownMuteIcon from './DownMuteIcon';
import { Styles } from '../../domain/types';
import { toArray } from '../../lib/array';
// import { AllSystemCSSProperties } from '@mui/system/styleFunctionSx';

type MuteIconButtonParam = {
  sx?: Styles;
  disabled?: boolean;
  mute: boolean;
  onClick: () => void;
  iconFontSize: (theme: Theme) => string[];
};

const MuteIconButton = ({ sx, disabled = false, mute, onClick, iconFontSize }: MuteIconButtonParam) => {
  return (
    // <Tooltip title={mute ? 'Unmute' : 'Mute'}>
      // <span>
        <Button variant="outlined"
          disabled={disabled}
          sx={[{ color: 'black' }, ...toArray(sx), mute && { color: 'red' }]}
          onClick={onClick}
          aria-label="Mute"
        >
          <DownMuteIcon sx={{ fontSize: iconFontSize }} mute={mute} />
        </Button>
      // </span>
    // </Tooltip>
  );
};

export default MuteIconButton;
