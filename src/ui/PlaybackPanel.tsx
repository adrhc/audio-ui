import { Box, IconButton, Tooltip } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoParamsProc, PlaybackState, Styles } from '../lib/types';
// import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayOrResumeButton from './PlayOrResumeButton';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AudioFileIcon from '@mui/icons-material/AudioFile';
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
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.25)))
  },
};

export type AudioButtonsParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  previous: NoParamsProc;
  next: NoParamsProc;
  stop: NoParamsProc;
  pause: NoParamsProc;
  play: NoParamsProc;
  resume: NoParamsProc;
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
}: AudioButtonsParam) {
  const stopEnabled = !!status && status !== 'stopped';
  const pauseEnabled = status === 'playing';

  return (
    <Box sx={{ ...BORDER, ...SX.box }}>
      <IconButton sx={SX.btn} component={Link} to="/trackList">
        <AudioFileIcon sx={SX.icon} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={() => previous()}>
        <NavigateBeforeIcon sx={SX.icon} />
      </IconButton>
      <IconButton disabled={disabled || !pauseEnabled} sx={SX.btn} onClick={() => pause()}>
        <PauseIcon sx={SX.icon} />
      </IconButton>
      <PlayOrResumeButton
        disabled={disabled}
        status={status}
        play={play}
        resume={resume}
        sx={SX}
      />
      <IconButton disabled={disabled || !stopEnabled} sx={SX.btn} onClick={() => stop()}>
        <StopIcon sx={SX.icon} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={() => next()}>
        <NavigateNextIcon sx={SX.icon} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn}>
        <TuneIcon sx={SX.icon} />
      </IconButton>
    </Box>
  );
}
