import { VolumeMute, VolumeDown } from '@mui/icons-material';
import { Styles } from '../../domain/types';

export default function DownMuteIcon({ mute, sx }: { mute: boolean, sx?: Styles }) {
  if (mute) {
    return <VolumeMute sx={sx} />;
  } else {
    return <VolumeDown sx={sx} />;
  }
}
