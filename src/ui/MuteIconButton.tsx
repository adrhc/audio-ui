import { Tooltip, IconButton } from '@mui/material';
import DownMuteIcon from './DownMuteIcon';
import { Styles } from '../lib/types';
import { toArray } from '../lib/array';
// import { AllSystemCSSProperties } from '@mui/system/styleFunctionSx';

type MuteIconButtonParam = {
  styles: Styles;
  mute: boolean;
  onClick: () => void;
};

const MuteIconButton = ({ styles, mute, onClick }: MuteIconButtonParam) => {
  return (
    <Tooltip title={mute ? 'Unmute' : 'Mute'}>
      <IconButton
        sx={[{ color: 'black' }, ...toArray(styles), mute && { color: 'red' }]}
        onClick={onClick}
        aria-label="Mute"
      >
        <DownMuteIcon mute={mute} />
      </IconButton>
    </Tooltip>
  );
};

export default MuteIconButton;
