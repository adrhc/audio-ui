import { Tooltip, IconButton } from '@mui/material';
import { NoParamsProc, PlaybackState, Styles } from '../lib/types';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export type PlayOrResumeButtonParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  play: NoParamsProc;
  resume: NoParamsProc;
  sx: Record<'btn' | 'icon', Styles>;
};

export default function PlayOrResumeButton({ disabled, status, play, resume, sx }: PlayOrResumeButtonParam) {
  switch (status) {
    case 'paused':
      return (
        <>
          <Tooltip title="Resume">
            <IconButton sx={sx.btn} onClick={() => resume()} disabled={disabled}>
              <PlayCircleIcon sx={sx.icon} />
            </IconButton>
          </Tooltip>
        </>
      );
    case 'stopped':
      return (
        <>
          <Tooltip title="Play">
            <IconButton sx={sx.btn} onClick={() => play()} disabled={disabled}>
              <PlayCircleIcon sx={sx.icon} />
            </IconButton>
          </Tooltip>
        </>
      );
    default:
      return (
        <>
          {' '}
          <IconButton sx={sx.btn} onClick={() => play()} disabled={true}>
            <PlayCircleIcon sx={sx.icon} />
          </IconButton>
        </>
      );
  }
}
