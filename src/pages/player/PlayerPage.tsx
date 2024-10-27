import { useSustainableState } from '../../hooks/useSustainableState';
import PageTemplate from '../../templates/PageTemplate';
import PlayerBottomPageMenu from '../../components/menu/PlayerBottomPageMenu';
import { SetFeedbackState } from '../../lib/sustain/types';
import PlayerPageState from './PlayerPageState';
import { useContext } from 'react';
import ExactVolumePanel from '../../components/panel/ExactVolumePanel';
import MopidyPlayOptions from '../../components/panel/MopidyPlayOptions';
import PlaybackPanel from '../../components/panel/PlaybackPanel';
import PrevNextPanel from '../../components/panel/PrevNextPanel';
import VolumeButtonsPanel from '../../components/panel/VolumeButtonsPanel';
import { truncateVolume } from '../../domain/utils';
import { AppContext } from '../../hooks/AppContext';
import useMopidyVolume from '../../hooks/useMopidyVolume';
import {
  mute as muteMopidy,
  stop as stopMopidy,
  pause as pauseMopidy,
  next,
  previous,
} from '../../infrastructure/mopidy/mpc/player';
import { play, resume } from '../../infrastructure/mopidy/player';
import PlayerPageTitle from './PlayerPageTitle';
import '/src/styles/panel.scss';
import './PlayerPage.scss';

export default function PlayerPage() {
  const [state, sustain, setState] = useSustainableState<PlayerPageState>({ tuneOn: false });
  console.log(`[PlayerPage] state:\n`, state);
  const { setVolume } = useMopidyVolume(sustain);
  const { mopidy, pbStatus, mute, volume } = useContext(AppContext);

  return (
    <PageTemplate
      className="player-page"
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<PlayerBottomPageMenu />}
    >
      <PlayerPageTitle />
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
  );
}
