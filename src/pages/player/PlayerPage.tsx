import { useSustainableState } from '../../hooks/useSustainableState';
import PageTemplate from '../../templates/PageTemplate';
import PlayerBottomPageMenu from '../../components/menu/PlayerBottomPageMenu';
import { SetFeedbackState } from '../../lib/sustain/types';
import PlayerPageBody from './PlayerPageBody';
import PlayerPageState from './PlayerPageState';
import '/src/styles/panel.scss';
import './PlayerPage.scss';

export default function PlayerPage() {
  const [state, sustain, setState] = useSustainableState<PlayerPageState>({ tuneOn: false });

  console.log(`[PlayerPage] state:\n`, state);

  return (
    <PageTemplate
      className="player-page"
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<PlayerBottomPageMenu />}
    >
      <PlayerPageBody {...{ state, sustain, setState }} />
    </PageTemplate>
  );
}
