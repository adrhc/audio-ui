import { Box, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { NoParamsProc, PlaybackState, Styles } from '../lib/types';
import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';

export type AudioButtonsParam = {
  styles?: Styles;
  state: PlaybackState | undefined;
  stop: NoParamsProc;
  pause: NoParamsProc;
  play: NoParamsProc;
  resume: NoParamsProc;
  refresh: NoParamsProc;
};

const AudioPanel = ({ styles, state, stop, pause, play, resume, refresh }: AudioButtonsParam) => {
  const stopEnabled = !!state && state !== 'stopped';
  const pauseEnabled = state === 'playing';

  function PlayOrResumeButton() {
    switch (state) {
      case 'paused':
        return (
          <>
            <Tooltip title="Resume">
              <IconButton sx={{ color: 'black' }} onClick={() => resume()}>
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'stopped':
        return (
          <>
            <Tooltip title="Play">
              <IconButton sx={{ color: 'black' }} onClick={() => play()}>
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      default:
        return (
          <>
            {' '}
            <IconButton sx={{ color: 'black' }} onClick={() => play()} disabled={true}>
              <PlayArrowIcon />
            </IconButton>
          </>
        );
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...styles,
      }}
    >
      <IconButton sx={{ color: 'black' }} onClick={() => stop()} disabled={!stopEnabled}>
        <StopIcon />
      </IconButton>
      <IconButton sx={{ color: 'black' }} onClick={() => pause()} disabled={!pauseEnabled}>
        <PauseIcon />
      </IconButton>
      <PlayOrResumeButton />
      <Tooltip title="Reload the page">
        <IconButton sx={{ color: 'black' }} onClick={() => refresh()}>
          <RestartAlt />
          {/* <Autorenew /> */}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AudioPanel;
