import { Box, IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc, PlaybackState, Styles } from '../lib/types';
// import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayOrResumeButton from './PlayOrResumeButton';
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { Link } from 'react-router-dom';

const SX: Record<string, Styles> = {
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    color: 'black',
    p: 0,
  },
  icon: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1 : 0.75))),
  },
  pl: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.5))),
  },
  tune: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? -0.35 : -0.1))),
  },
  bf: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1.25 : 0.75))),
  },
};

export type AudioButtonsParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  previous: NoArgsProc;
  next: NoArgsProc;
  stop: NoArgsProc;
  pause: NoArgsProc;
  play: NoArgsProc;
  resume: NoArgsProc;
  toggleTune: NoArgsProc;
};

export default function PlaybackPanel({
  disabled,
  status,
  previous,
  next,
  stop,
  pause,
  play,
  resume,
  toggleTune,
}: AudioButtonsParam) {
  const stopEnabled = !!status && status !== 'stopped';
  const pauseEnabled = status === 'playing';

  return (
    <Box sx={{ ...BORDER, ...SX.box }}>
      <IconButton disabled={disabled} sx={SX.btn} component={Link} to="/trackList">
        <QueueMusicOutlinedIcon sx={SX.pl} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={() => previous()}>
        <NavigateBeforeIcon sx={SX.bf} />
      </IconButton>
      <IconButton disabled={disabled || !pauseEnabled} sx={SX.btn} onClick={() => pause()}>
        <PauseIcon sx={SX.icon} />
      </IconButton>
      <PlayOrResumeButton disabled={disabled} status={status} play={play} resume={resume} sx={SX} />
      <IconButton disabled={disabled || !stopEnabled} sx={SX.btn} onClick={() => stop()}>
        <StopIcon sx={SX.icon} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={() => next()}>
        <NavigateNextIcon sx={SX.bf} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={toggleTune}>
        <TuneIcon sx={SX.tune} />
      </IconButton>
    </Box>
  );
}
