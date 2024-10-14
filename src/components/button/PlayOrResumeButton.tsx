import { Theme, Button } from '@mui/material';
import { NoArgsProc, PlaybackState, Styles } from '../../domain/types';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useContext } from 'react';
import { AppContext } from '../../hooks/AppContext';

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
  disabled,
  status,
  play,
  resume,
  iconFontSize,
}: PlayOrResumeButtonParam) {
  const { online } = useContext(AppContext);
  const disabledBtn = disabled ?? !online;
  switch (status) {
    case 'paused':
      return (
        <>
          {/* <Tooltip title="Resume"> */}
          {/* <span> */}
          <Button variant="outlined" sx={sx} onClick={resume} disabled={disabledBtn} aria-label="Resume">
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
          <Button variant="outlined" sx={sx} onClick={play} disabled={disabledBtn} aria-label="Play">
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
