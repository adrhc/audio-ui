import { useContext } from 'react';
import { SustainVoidFn } from '../../hooks/useSustainableState';
import VolumeButtonsPanel from '../../components/panel/VolumeButtonsPanel';
import {
  mute as muteMopidy,
  stop as stopMopidy,
  pause as pauseMopidy,
  next,
  previous,
} from '../../infrastructure/mopidy/mpc/player';
import { play, resume } from '../../infrastructure/mopidy/player';
import PlaybackPanel from '../../components/panel/PlaybackPanel';
import ExactVolumePanel from '../../components/panel/ExactVolumePanel';
import MopidyPlayOptions from '../../components/panel/MopidyPlayOptions';
import PrevNextPanel from '../../components/panel/PrevNextPanel';
import { AppContext } from '../../hooks/AppContext';
import { LoadingState, SetLoadingState } from '../../lib/sustain/types';
import { truncateVolume } from '../../domain/utils';
import PlayerPageState from './PlayerPageState';
import useMopidyVolume from '../../hooks/useMopidyVolume';
import PlayerTitle from './PlayerTitle';

interface PlayerPageBodyProps {
  state: LoadingState<PlayerPageState>;
  setState: SetLoadingState<PlayerPageState>;
  sustain: SustainVoidFn<PlayerPageState>;
}

function PlayerPageBody({ state, setState, sustain }: PlayerPageBodyProps) {
  const { mopidy, pbStatus, mute, volume } = useContext(AppContext);

  const { setVolume } = useMopidyVolume(sustain);

  return (
    <>
      <PlayerTitle />
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
    </>
  );
}

export default PlayerPageBody;
