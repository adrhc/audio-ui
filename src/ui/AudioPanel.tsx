import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StopIcon from '@mui/icons-material/Stop';
import { NoParamsProc, Styles } from '../lib/types';

export type AudioButtonsParam = {
  styles?: Styles;
  play: NoParamsProc;
  stop: NoParamsProc;
  refresh: NoParamsProc;
};

const AudioPanel = ({ styles, play, stop, refresh }: AudioButtonsParam) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...styles,
      }}
    >
      <IconButton onClick={() => play()}>
        <StopIcon />
      </IconButton>
      <IconButton onClick={() => stop()}>
        <PlayArrowIcon />
      </IconButton>
      <IconButton onClick={() => refresh()}>
        <AutorenewIcon />
      </IconButton>
    </Box>
  );
};

export default AudioPanel;
