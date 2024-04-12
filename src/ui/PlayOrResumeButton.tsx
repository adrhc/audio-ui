import { Tooltip, IconButton, Theme } from '@mui/material';
import { NoArgsProc, PlaybackState, Styles } from '../lib/types';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export type PlayOrResumeButtonParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  play: NoArgsProc;
  resume: NoArgsProc;
  btnSx: Styles;
  iconFontSize: (theme: Theme) => string[];
};

export default function PlayOrResumeButton({
  disabled,
  status,
  play,
  resume,
  btnSx,
  iconFontSize,
}: PlayOrResumeButtonParam) {
  switch (status) {
    case 'paused':
      return (
        <>
          <Tooltip title="Resume">
            <span>
              <IconButton sx={btnSx} onClick={() => resume()} disabled={disabled}>
                <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
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
              <IconButton sx={btnSx} onClick={() => play()} disabled={disabled}>
                <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    default:
      return (
        <>
          {' '}
          <IconButton sx={btnSx} onClick={() => play()} disabled={true}>
            <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
          </IconButton>
        </>
      );
  }
}
