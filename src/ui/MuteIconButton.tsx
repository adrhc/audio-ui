import { Tooltip, IconButton } from '@mui/material';
import DownMuteIcon from './DownMuteIcon';
import { Styles } from '../lib/types';
import { toArray } from '../lib/array';
// import { AllSystemCSSProperties } from '@mui/system/styleFunctionSx';

type MuteIconButtonParam = {
  sx: Styles;
  disabled?: boolean;
  mute: boolean;
  onClick: () => void;
};

const MuteIconButton = ({ sx, disabled, mute, onClick }: MuteIconButtonParam) => {
  return (
    <Tooltip title={mute ? 'Unmute' : 'Mute'}>
      <span>
        <IconButton
          disabled={disabled}
          sx={[{ color: 'black' }, ...toArray(sx), mute && { color: 'red' }]}
          onClick={onClick}
          aria-label="Mute"
        >
          <DownMuteIcon mute={mute} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default MuteIconButton;
