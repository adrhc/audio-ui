import { Box, IconButton, useMediaQuery } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc, PlaybackState, Styles } from '../lib/types';
// import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayOrResumeButton from './PlayOrResumeButton';
import SubjectIcon from '@mui/icons-material/Subject';
import TuneIcon from '@mui/icons-material/Tune';
import { Link } from 'react-router-dom';

export type PlaybackPanelParam = {
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

const SX: Record<string, Styles> = {
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  btn: {
    color: 'black',
    p: 0,
  },
  icon: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? 1 : 0.75))),
  },
  pause: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? -0.25 : 0))),
  },
  pl: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? -0.35 : -0.1))),
  },
  tune: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? -0.35 : -0.1))),
  },
  bf: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.5 + (i == 0 ? 1 : 0.75))),
  },
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
}: PlaybackPanelParam) {
  const stopEnabled = !!status && status !== 'stopped';
  const pauseEnabled = status === 'playing';
  const justifyContent = useMediaQuery(`(min-width:475px)`, { noSsr: true }) ? 'space-evenly' : 'center';

  return (
    <Box sx={{ ...BORDER, ...SX.box, justifyContent }}>
      <IconButton disabled={disabled} sx={SX.btn} component={Link} to="/trackList">
        <SubjectIcon sx={SX.pl} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={() => previous()}>
        <NavigateBeforeIcon sx={SX.bf} />
      </IconButton>
      <IconButton disabled={disabled || !pauseEnabled} sx={SX.btn} onClick={() => pause()}>
        <PauseIcon sx={SX.pause} />
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
