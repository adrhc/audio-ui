import { Box, IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc, PlaybackState } from '../lib/types';
// import { RestartAlt } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import { BORDER, playIconFontSizeMap } from './VolumePage-styles';
import PlayOrResumeButton from './PlayOrResumeButton';
import MuteIconButton from './MuteIconButton';

export type PlaybackPanelParam = {
  disabled: boolean;
  status: PlaybackState | undefined;
  stop: NoArgsProc;
  pause: NoArgsProc;
  play: NoArgsProc;
  resume: NoArgsProc;
  mute: boolean;
  onMute: NoArgsProc;
};

const btn = { color: 'black', p: 0.35 };
const pauseBtn = { color: 'black', p: 0.5 };
const playBtn = { color: 'black', p: 0 };
const muteBtn = { color: 'black', p: 0.25 };
const playFontSize = playIconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.8 : 0.8)));
const stopFontSize = playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.385 + (i == 0 ? 1 : 1)));
const pauseFontSize = playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.375 + (i == 0 ? 0 : 0)));
const muteFontSize = playIconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.25)));

export default function PlaybackPanel({
  disabled,
  status,
  stop,
  pause,
  play,
  resume,
  mute,
  onMute,
}: PlaybackPanelParam) {
  const stopEnabled = !!status && status !== 'stopped';
  const pauseEnabled = status === 'playing';
  // const justifyContent = useSpaceEvenly();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', ...BORDER }}>
      <IconButton disabled={disabled || !pauseEnabled} sx={pauseBtn} onClick={pause}>
        <PauseIcon sx={{ fontSize: pauseFontSize }} />
      </IconButton>
      <PlayOrResumeButton
        disabled={disabled}
        status={status}
        play={play}
        resume={resume}
        btnSx={playBtn}
        iconFontSize={playFontSize}
      />
      <IconButton disabled={disabled || !stopEnabled} sx={btn} onClick={stop}>
        <StopIcon sx={{ fontSize: stopFontSize }} />
      </IconButton>
      <MuteIconButton
        disabled={disabled}
        sx={{ ...muteBtn, '& .MuiSvgIcon-root': { fontSize: muteFontSize } }}
        mute={mute}
        onClick={onMute}
      />
    </Box>
  );
}
