import { Badge, Box } from '@mui/material';
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
} from '../datasource/mpc/mpc';
import { play, resume } from '../datasource/mpc/player';
import PlaybackPanel from '../components/panel/PlaybackPanel';
import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import MopidyPlayOptions from '../components/panel/MopidyPlayOptions';
import PrevNextPanel from '../components/panel/PrevNextPanel';
import PageTemplate from '../templates/PageTemplate';
import { AppContext } from '../hooks/AppContext';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import PlayerBottomPageMenu from '../components/menu/PlayerBottomPageMenu';
import { SetFeedbackState } from '../lib/sustain';
import PageTitle from '../components/PageTitle';
import { truncateVolume } from '../domain/utils';
import '/src/styles/panel.scss';
import './PlayerPage.scss';

type PlayerPageState = {
  tuneOn: boolean;
};

export default function PlayerPage() {
  const { mopidy, pbStatus, currentSong, streamTitle, boost, mute, volume, setBaseVolume } =
    useContext(AppContext);

  // const [logs, setLogs] = useState<string[]>([]);
  const [state, sustain, setState] = useSustainableState<PlayerPageState>({ tuneOn: false });

  console.log(`[PlayerPage] state:\n`, state);

  const setVolume = useCallback(
    (newVolume: number) => {
      const newBaseVolume = truncateVolume(newVolume - boost);
      console.log(
        `[PlayerPage:setVolume] newBaseVolume = ${newBaseVolume}, boost = ${boost}, newVolume = ${newVolume}`
      );
      // see "boostedVolume - boost" in audio-web-services too (aka "in java")
      sustain(
        // setMopidyVolume and setBaseVolume truncate to [0,100]
        setMopidyVolume(mopidy, newVolume)?.then(() => setBaseVolume(newBaseVolume)),
        `Couldn't set the volume to ${newVolume}!`,
        true
      );
    },
    [boost, mopidy, setBaseVolume, sustain]
  );

  return (
    <>
      <PageTemplate
        className="player-page"
        state={state}
        setState={setState as SetFeedbackState}
        bottom={<PlayerBottomPageMenu />}
      >
        {currentSong?.tlid && (
          <Box className="ignored">
            <PageTitle>
              <Badge color={boost < 0 ? 'warning' : 'info'} badgeContent={boost} invisible={boost == 0}>
                <Link to="/audio-boost">
                  <SurroundSoundIcon />
                </Link>
              </Badge>
              &nbsp;{currentSong?.title}
            </PageTitle>
            <PageTitle>{streamTitle ?? currentSong?.artists}</PageTitle>
          </Box>
        )}
        <ExactVolumePanel values={[5, 15, 25, 45, 65, 80]} onChange={setVolume} />
        <PlaybackPanel
          status={pbStatus}
          mute={mute}
          onMute={() => sustain(muteMopidy(mopidy, !mute), 'Failed to mute!', true)}
          pause={() => sustain(pauseMopidy(mopidy), 'Failed to pause!', true)}
          stop={() => sustain(stopMopidy(mopidy), 'Failed to stop!', true)}
          play={() => sustain(play(mopidy), 'Failed to play!', true)}
          resume={() => sustain(resume(mopidy), 'Failed to resume!', true)}
        />
        <VolumeButtonsPanel
          volume={volume}
          onIncrement={(increment) => setVolume(truncateVolume(volume + increment))}
        />
        <PrevNextPanel
          previous={() => sustain(previous(mopidy), 'Failed to go previous!', true)}
          next={() => sustain(next(mopidy), 'Failed to go next!', true)}
          toggleTune={() => setState((old) => ({ ...old, tuneOn: !state.tuneOn }))}
        />
        {state.tuneOn && <MopidyPlayOptions />}
      </PageTemplate>
      {/* <Logs logs={logs} /> */}
    </>
  );
}
