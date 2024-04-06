import { Box, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { NoParamsProc, PlaybackState, Styles } from '../lib/types';
import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, iconFontSizeMap } from './VolumePage-styles';

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
    fontSize: iconFontSizeMap(ifs => ifs.map((n, i) => n + (i == 0 ? 1.5 : 0.5))), // [48, 40],
  }
};

export type AudioButtonsParam = {
  styles?: Styles;
  state: PlaybackState | undefined;
  stop: NoParamsProc;
  pause: NoParamsProc;
  play: NoParamsProc;
  resume: NoParamsProc;
  refresh: NoParamsProc;
};

const PlaybackPanel = ({ styles, state, stop, pause, play, resume, refresh }: AudioButtonsParam) => {
  const stopEnabled = !!state && state !== 'stopped';
  const pauseEnabled = state === 'playing';

  function PlayOrResumeButton() {
    switch (state) {
      case 'paused':
        return (
          <>
            <Tooltip title="Resume">
              <IconButton sx={SX.btn} onClick={() => resume()}>
                <PlayArrowIcon sx={SX.icon} />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'stopped':
        return (
          <>
            <Tooltip title="Play">
              <IconButton sx={SX.btn} onClick={() => play()}>
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
    <Box sx={{ ...BORDER, ...SX.box, ...styles } as Styles}>
      <IconButton sx={SX.btn} onClick={() => stop()} disabled={!stopEnabled}>
        <StopIcon sx={SX.icon} />
      </IconButton>
      <IconButton sx={SX.btn} onClick={() => pause()} disabled={!pauseEnabled}>
        <PauseIcon sx={SX.icon} />
      </IconButton>
      <PlayOrResumeButton />
      <Tooltip title="Reload the page">
        <IconButton sx={SX.btn} onClick={() => refresh()}>
          <RestartAlt sx={SX.icon} />
          {/* <Autorenew sx={SX.icon} /> */}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default PlaybackPanel;
