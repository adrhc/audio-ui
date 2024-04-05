import { VolumeMute, VolumeDown } from '@mui/icons-material';

export default function DownMuteIcon({ mute }: { mute: boolean }) {
  if (mute) {
    return <VolumeMute />;
  } else {
    return <VolumeDown />;
  }
}
