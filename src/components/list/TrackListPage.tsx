import { useCallback, useContext, useEffect } from 'react';
import { getTracks } from '../../infrastructure/mpc/track/read';
import { play } from '../../infrastructure/mpc/player';
import PageTemplate from '../../templates/PageTemplate';
import { useSustainableState } from '../../hooks/useSustainableState';
import { AppContext } from '../../hooks/AppContext';
import { removeTlid } from '../../infrastructure/mpc/mpc';
import TrackList from './TrackList';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import { Track, removeTrack } from '../../domain/track';
import TrackListMenu from '../menu/TrackListBottomPageMenu';
import { SetFeedbackState } from '../../lib/sustain';
import '/src/styles/wide-page.scss';

type TrackListPageState = {
  songs: Track[];
  songCloseToLastRemoved?: Track;
};

export default function TrackListPage() {
  const { mopidy, online } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<TrackListPageState>({ songs: [] });
  // console.log(`[TrackListPage] online = ${online}, state:`, state);
  const imgMaxEdge = useMaxEdge();

  const handleRemove = useCallback(
    (song: Track) => {
      // console.log(`[TrackListPage:onRemove] song:\n`, song);
      if (song.tlid) {
        sustain(
          removeTlid(mopidy, song.tlid)?.then(() => removeTrack(state.songs, song)),
          { error: `Failed to remove ${song.title}!`, songCloseToLastRemoved: song }
        );
      } else {
        setState((old) => ({ ...old, error: 'Something is wrong with the song to remove!' }));
      }
    },
    [mopidy, setState, state.songs, sustain]
  );

  const handleSelection = useCallback(
    (song: Track) => {
      if (song.tlid) {
        sustain(play(mopidy, song.tlid), `Failed to play ${song.title}!`);
      } else {
        setState((old) => ({ ...old, error: 'Something is wrong with the selected song!' }));
      }
    },
    [mopidy, setState, sustain]
  );

  useEffect(() => {
    if (online) {
      console.log(`[TrackListPage:online] loading the track list`);
      sustain(
        getTracks(mopidy, imgMaxEdge)?.then((songs) => ({ songs })),
        "Can't load the track list!"
      );
    }
  }, [imgMaxEdge, mopidy, online, sustain]);

  // console.log(`[TrackListPage] getUA:\n`, getUA);
  // console.log(`[TrackListPage] agent:\n`, agent);
  // console.log(`[TrackListPage] agent.isIPhone = ${ifIPhone(true, false)}, agent.isTablet = ${isTablet}`);

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TrackListMenu sustain={sustain} />}
      disableSpinner={true}
    >
      <TrackList
        songs={state.songs}
        loading={state.loading}
        onRemove={handleRemove}
        onClick={handleSelection}
        songCloseToLastRemoved={state.songCloseToLastRemoved}
      />
    </PageTemplate>
  );
}
