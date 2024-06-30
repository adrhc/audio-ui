import { Theme, Button } from '@mui/material';
import { NoArgsProc, PlaybackState, Styles } from '../../domain/types';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export type PlayOrResumeButtonParam = {
  sx?: Styles;
  disabled?: boolean;
  status: PlaybackState | undefined;
  play: NoArgsProc;
  resume: NoArgsProc;
  iconFontSize: (theme: Theme) => string[];
};

export default function PlayOrResumeButton({
  sx,
  disabled = false,
  status,
  play,
  resume,
  iconFontSize,
}: PlayOrResumeButtonParam) {
  switch (status) {
    case 'paused':
      return (
        <>
          {/* <Tooltip title="Resume"> */}
          {/* <span> */}
          <Button variant="outlined" sx={sx} onClick={resume} disabled={disabled} aria-label="Resume">
            <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
          </Button>
          {/* </span> */}
          {/* </Tooltip> */}
        </>
      );
    case 'stopped':
      return (
        <>
          {/* <Tooltip title="Play"> */}
          {/* <span> */}
          <Button variant="outlined" sx={sx} onClick={play} disabled={disabled} aria-label="Play">
            <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
          </Button>
          {/* </span> */}
          {/* </Tooltip> */}
        </>
      );
    default:
      return (
        <Button variant="outlined" sx={sx} onClick={play} disabled={true} aria-label="Play">
          <PlayCircleIcon sx={{ fontSize: iconFontSize }} />
        </Button>
      );
  }
}
