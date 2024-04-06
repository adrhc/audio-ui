import { Tooltip, IconButton } from '@mui/material';
import DownMuteIcon from './DownMuteIcon';
import { Styles } from '../lib/types';

type MuteIconButtonParam = {
  styles?: Styles;
  mute: boolean;
  onClick: () => void;
};

const MuteIconButton = ({ styles, mute, onClick }: MuteIconButtonParam) => {
  const color = mute ? 'red' : styles?.color ? styles.color : 'black';
  return (
    <Tooltip title={mute ? 'Unmute' : 'Mute'}>
      <IconButton sx={{ color, ...styles }} onClick={onClick} aria-label="Mute">
        <DownMuteIcon mute={mute} />
      </IconButton>
    </Tooltip>
  );
};

export default MuteIconButton;
