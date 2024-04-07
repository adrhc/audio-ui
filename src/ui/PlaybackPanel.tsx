import { Box, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { NoParamsProc, PlaybackState, Styles } from '../lib/types';
import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1.5 : 0.5))), // [48, 40]
  },
  reload: {
    fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.25))),
  },
};

export type AudioButtonsParam = {
  disabled: boolean;
  state: PlaybackState | undefined;
  previous: NoParamsProc;
  next: NoParamsProc;
  stop: NoParamsProc;
  pause: NoParamsProc;
  play: NoParamsProc;
  resume: NoParamsProc;
  reload: NoParamsProc;
};

export default function PlaybackPanel({
  disabled,
  state,
  previous,
  next,
  stop,
  pause,
  play,
  resume,
  reload,
}: AudioButtonsParam) {
  const stopEnabled = !!state && state !== 'stopped';
  const pauseEnabled = state === 'playing';

  function PlayOrResumeButton() {
    switch (state) {
      case 'paused':
        return (
          <>
            <Tooltip title="Resume">
              <IconButton sx={SX.btn} onClick={() => resume()} disabled={disabled}>
                <PlayArrowIcon sx={SX.icon} />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'stopped':
        return (
          <>
            <Tooltip title="Play">
              <IconButton sx={SX.btn} onClick={() => play()} disabled={disabled}>
                <PlayArrowIcon sx={SX.icon} />
              </IconButton>
            </Tooltip>
          </>
        );
      default:
        return (
          <>
            {' '}
            <IconButton sx={SX.btn} onClick={() => play()} disabled={true}>
              <PlayArrowIcon sx={SX.icon} />
            </IconButton>
          </>
        );
    }
  }

  return (
    <Box sx={{ ...BORDER, ...SX.box }}>
      <IconButton sx={SX.btn} onClick={() => previous()} disabled={disabled}>
        <NavigateBeforeIcon sx={SX.icon} />
      </IconButton>
      <IconButton sx={SX.btn} onClick={() => stop()} disabled={disabled || !stopEnabled}>
        <StopIcon sx={SX.icon} />
      </IconButton>
      <IconButton sx={SX.btn} onClick={() => pause()} disabled={disabled || !pauseEnabled}>
        <PauseIcon sx={SX.icon} />
      </IconButton>
      <PlayOrResumeButton />
      <Tooltip title="Reload the page">
        <IconButton sx={SX.btn} onClick={() => reload()}>
          <RestartAlt sx={SX.reload} />
          {/* <Autorenew sx={SX.icon} /> */}
        </IconButton>
      </Tooltip>
      <IconButton sx={SX.btn} onClick={() => next()} disabled={disabled}>
        <NavigateNextIcon sx={SX.icon} />
      </IconButton>
    </Box>
  );
}
