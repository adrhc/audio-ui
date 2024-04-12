import { Box, IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc, PlaybackState, Styles } from '../lib/types';
// import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, playIconFontSizeMap } from './VolumePage-styles';
import PlayOrResumeButton from './PlayOrResumeButton';

export type PlaybackPanelParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  stop: NoArgsProc;
  pause: NoArgsProc;
  play: NoArgsProc;
  resume: NoArgsProc;
};

const SX: Record<string, Styles> = {
  // btn is used by PlayOrResumeButton too!
  btn: {
    color: 'black',
    p: 0.35,
  },
  // icon is used by PlayOrResumeButton too!
  icon: {
    fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? 1 : 0.75))),
  },
  pause: {
    fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? 0 : 0))),
  },
};

export default function PlaybackPanel({ disabled, status, stop, pause, play, resume }: PlaybackPanelParam) {
  const stopEnabled = !!status && status !== 'stopped';
  const pauseEnabled = status === 'playing';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', ...BORDER }}>
      <IconButton disabled={disabled || !pauseEnabled} sx={{...SX.btn, p: 0.75}} onClick={() => pause()}>
        <PauseIcon sx={SX.pause} />
      </IconButton>
      <PlayOrResumeButton disabled={disabled} status={status} play={play} resume={resume} sx={SX} />
      <IconButton disabled={disabled || !stopEnabled} sx={SX.btn} onClick={() => stop()}>
        <StopIcon sx={SX.icon} />
      </IconButton>
    </Box>
  );
}
