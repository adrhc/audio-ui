import { Badge, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCallback, useContext } from 'react';
import { useSustainableState } from '../hooks/useSustainableState';
import VolumeButtonsPanel from '../components/panel/VolumeButtonsPanel';
import {
  setVolume as setMopidyVolume,
  mute as muteMopidy,
  stop as stopMopidy,
  pause as pauseMopidy,
  next,
  previous,
} from '../services/mpc';
import { play, resume } from '../services/player';
import PlaybackPanel from '../components/panel/PlaybackPanel';
import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import MopidyPlayOptions from '../components/panel/MopidyPlayOptions';
import ShowIf from '../components/ShowIf';
import PrevNextPanel from '../components/panel/PrevNextPanel';
import PageTemplate from '../templates/PageTemplate';
import { AppContext } from '../components/app/AppContext';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import { MOPIDY_DISCONNECTED_ERROR } from '../constants';
import PlayerBottomPageMenu from '../components/menu/PlayerBottomPageMenu';
import { SetFeedbackState } from '../lib/sustain';
import '/src/styles/panel.scss';
import './PlayerPage.scss';

type PlayerPageState = {
  tuneOn: boolean;
};

export default function PlayerPage() {
  const {
    mopidy,
    online,
    pbStatus,
    currentSong,
    streamTitle,
    volume,
    boost,
    mute,
    setBaseVolume,
    setNotification,
  } = useContext(AppContext);
  // const [logs, setLogs] = useState<string[]>([]);
  const [state, sustain, setState] = useSustainableState<PlayerPageState>({ tuneOn: false });

  console.log(`[PlayerPage] online = ${online}, state:\n`, state);

  const onVolumeChange = useCallback(
    (boostedVolume: number) => {
      console.log(`[PlayerPage:onVolumeChange] boost = ${boost}, boostedVolume = ${boostedVolume}`);
      // addLog(`[PlayerPage:onVolumeChange] boostedVolume = ${boostedVolume}`);
      if (mopidy != null) {
        // see "boostedVolume - boost" in audio-web-services too (aka "in java")
        sustain(
          setMopidyVolume(mopidy, boostedVolume)?.then(() => setBaseVolume(boostedVolume - boost)),
          `Couldn't set the volume to ${boostedVolume}!`,
          true
        );
      } else {
        console.error(`[PlayerPage:onVolumeChange] boostedVolume = ${boostedVolume}`, mopidy);
        setNotification(MOPIDY_DISCONNECTED_ERROR);
      }
    },
    [boost, mopidy, setBaseVolume, setNotification, sustain]
  );

  return (
    <>
      <PageTemplate
        className="player-page"
        state={state}
        setState={setState as SetFeedbackState}
        bottom={<PlayerBottomPageMenu />}
      >
        <ShowIf condition={!!currentSong?.tlid}>
          <Box className="ignored">
            <Typography variant="h6" className="title">
              <Badge color={boost < 0 ? 'warning' : 'info'} badgeContent={boost} invisible={boost == 0}>
                <Link to="/audio-boost">
                  <SurroundSoundIcon />
                </Link>
              </Badge>
              &nbsp;{currentSong?.title}
            </Typography>
            <Typography variant="h6" className="title">
              {streamTitle ?? currentSong?.artists}
            </Typography>
          </Box>
        </ShowIf>
        <ExactVolumePanel disabled={!online} values={[5, 15, 25, 45, 65, 80]} onChange={onVolumeChange} />
        <PlaybackPanel
          disabled={!online}
          status={pbStatus}
          mute={mute}
          onMute={() => sustain(muteMopidy(mopidy, !mute), 'Failed to mute!', true)}
          pause={() => sustain(pauseMopidy(mopidy), 'Failed to pause!', true)}
          stop={() => sustain(stopMopidy(mopidy), 'Failed to stop!', true)}
          play={() => sustain(play(mopidy), 'Failed to play!', true)}
          resume={() => sustain(resume(mopidy), 'Failed to resume!', true)}
        />
        <VolumeButtonsPanel disabled={!online} badgeColor="info" volume={volume} onChange={onVolumeChange} />
        <PrevNextPanel
          disabled={!online}
          previous={() => sustain(previous(mopidy), 'Failed to go previous!', true)}
          next={() => sustain(next(mopidy), 'Failed to go next!', true)}
          toggleTune={() => setState((old) => ({ ...old, tuneOn: !state.tuneOn }))}
        />
        <ShowIf condition={state.tuneOn}>
          <MopidyPlayOptions />
        </ShowIf>
      </PageTemplate>
      {/* <Logs logs={logs} /> */}
    </>
  );
}
