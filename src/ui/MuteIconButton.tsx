import { Tooltip, IconButton } from '@mui/material';
import DownMuteIcon from './DownMuteIcon';

const MuteIconButton = ({ mute, onClick }: { mute: boolean; onClick: () => void }) => {
  return (
    <Tooltip title={mute ? 'Unmute' : 'Mute'}>
      <IconButton sx={{ color: mute ? 'red' : 'black' }} onClick={onClick} aria-label="Mute">
        <DownMuteIcon mute={mute} />
      </IconButton>
    </Tooltip>
  );
};

export default MuteIconButton;
