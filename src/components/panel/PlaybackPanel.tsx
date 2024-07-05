import { Button, ButtonGroup } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { NoArgsProc, PlaybackState, Styles } from '../../domain/types';
import PauseIcon from '@mui/icons-material/Pause';
import { iconFontSize } from '../../pages/styles';
import PlayOrResumeButton from '../button/PlayOrResumeButton';
import MuteIconButton from '../button/MuteIconButton';
import './PlaybackPanel.scss';
import { useContext } from 'react';
import { AppContext } from '../app/AppContext';

export type PlaybackPanelParam = {
  sx?: Styles;
  disabled?: boolean;
  status: PlaybackState | undefined;
  stop: NoArgsProc;
  pause: NoArgsProc;
  play: NoArgsProc;
  resume: NoArgsProc;
  mute: boolean;
  onMute: NoArgsProc;
};

/* const btn = { color: 'black', p: 0.35 };
const pauseBtn = { color: 'black', p: 0.5 };
const playBtn = { color: 'black', p: 0 };
const muteBtn = { color: 'black', p: 0.25 };
const playFontSize = playIconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.75)));
const stopFontSize = playIconFontSize((ifs) => ifs.map((n, i) => n + 0.385 + (i == 0 ? 1 : 1)));
const pauseFontSize = playIconFontSize((ifs) => ifs.map((n, i) => n + 0.375 + (i == 0 ? 0 : 0)));
const muteFontSize = playIconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.75 : 0.25))); */

export default function PlaybackPanel({
  disabled,
  status,
  stop,
  pause,
  play,
  resume,
  mute,
  onMute,
  sx,
}: PlaybackPanelParam) {
  const { online } = useContext(AppContext);
  const stopEnabled = online && !!status && status !== 'stopped';
  const pauseEnabled = online && status === 'playing';
  const fontSize = iconFontSize((fs) => fs.map((n) => n + 1));

  return (
    <ButtonGroup className="playback-panel" disabled={disabled ?? !online} sx={sx}>
      <Button variant="outlined" disabled={!pauseEnabled} onClick={pause}>
        <PauseIcon sx={{ fontSize }} />
      </Button>
      <PlayOrResumeButton
        disabled={disabled}
        status={status}
        play={play}
        resume={resume}
        iconFontSize={fontSize}
      />
      <Button variant="outlined" disabled={!stopEnabled} onClick={stop}>
        <StopIcon sx={{ fontSize }} />
      </Button>
      <MuteIconButton
        disabled={disabled}
        // sx={{ ...muteBtn, '& .MuiSvgIcon-root': { fontSize: muteFontSize } }}
        iconFontSize={fontSize}
        mute={mute}
        onClick={onMute}
      />
    </ButtonGroup>
  );
}
