import { Tooltip, IconButton } from '@mui/material';
import { NoArgsProc, PlaybackState, Styles } from '../lib/types';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export type PlayOrResumeButtonParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  play: NoArgsProc;
  resume: NoArgsProc;
  sx: Record<'btn' | 'icon', Styles>;
};

export default function PlayOrResumeButton({ disabled, status, play, resume, sx }: PlayOrResumeButtonParam) {
  switch (status) {
    case 'paused':
      return (
        <>
          <Tooltip title="Resume">
            <span>
              <IconButton sx={sx.btn} onClick={() => resume()} disabled={disabled}>
                <PlayCircleIcon sx={sx.icon} />
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    case 'stopped':
      return (
        <>
          <Tooltip title="Play">
            <span>
              <IconButton sx={sx.btn} onClick={() => play()} disabled={disabled}>
                <PlayCircleIcon sx={sx.icon} />
              </IconButton>
            </span>
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
