import { useCallback, useContext, useEffect } from 'react';
import { getTrackSongs } from '../../services/track-song';
import { Stack } from '@mui/material';
import { play } from '../../services/player';
import PageTemplate from '../../templates/PageTemplate';
import { useSustainableState } from '../../hooks/useSustainableState';
import { AppContext } from '../../components/app/AppContext';
import { removeTlid } from '../../services/mpc';
import TrackList from './TrackList';
import { useMaxEdge } from '../../constants';
import { TrackSong, removeSong } from '../../domain/track-song';
import TrackListMenu from '../../components/menu/TrackListBottomPageMenu';
import { SetFeedbackState } from '../../lib/sustain';
import './TrackListPage.scss';

type TrackListPageState = {
  songs: TrackSong[];
  songCloseToLastRemoved?: TrackSong;
};

export default function TrackListPage() {
  const { mopidy, online, currentSong } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<TrackListPageState>({ songs: [], loading: true });
  // console.log(`[TrackListPage] online = ${online}, currentSong:`, currentSong);
  // console.log(`[TrackListPage] online = ${online}, state:`, state);
  const imgMaxEdge = useMaxEdge();

  const handleRemove = useCallback(
    (song: TrackSong) => {
      // console.log(`[TrackListPage:onRemove] song:\n`, song);
      if (song.tlid) {
        sustain(
          removeTlid(mopidy, song.tlid)?.then(() => removeSong(state.songs, song)),
          { error: `Failed to remove ${song.title}!`, songCloseToLastRemoved: song }
        );
      } else {
        setState((old) => ({ ...old, error: 'Something is wrong with the song to remove!' }));
      }
    },
    [mopidy, setState, state.songs, sustain]
  );

  const handleSelection = useCallback(
    (song: TrackSong) => {
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
        getTrackSongs(mopidy, imgMaxEdge)?.then((songs) => ({ songs })),
        "Can't load the track list!"
      );
    } else {
      setState((old) => ({ ...old, loading: true }));
    }
  }, [imgMaxEdge, mopidy, online, setState, sustain]);

  // console.log(`[TrackListPage] getUA:\n`, getUA);
  // console.log(`[TrackListPage] agent:\n`, agent);
  // console.log(`[TrackListPage] agent.isIPhone = ${ifIPhone(true, false)}, agent.isTablet = ${isTablet}`);

  return (
    <PageTemplate
      className="track-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TrackListMenu sustain={sustain} />}
    >
      <Stack className="songs-wrapper">
        <TrackList
          songs={state.songs}
          currentSong={currentSong}
          onRemove={handleRemove}
          onClick={handleSelection}
          songCloseToLastRemoved={state.songCloseToLastRemoved}
        />
      </Stack>
    </PageTemplate>
  );
}
