import { useCallback, useContext, useEffect } from 'react';
import { getTracks } from '../../infrastructure/mopidy/playing-list/read';
import { play } from '../../infrastructure/mopidy/player';
import PageTemplate from '../../templates/PageTemplate';
import { useSustainableState } from '../../hooks/useSustainableState';
import { AppContext } from '../../hooks/AppContext';
import { removeTlid } from '../../infrastructure/mopidy/mpc/playing-list';
import TrackList from './TrackList';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import { Track, removeTrack } from '../../domain/track';
import TrackListMenu from '../menu/TrackListBottomPageMenu';
import { SetFeedbackState } from '../../lib/sustain/types';
import { downloadTrack } from '../../infrastructure/audio-db/download';
import { formatFileURI } from '../../domain/song';

type TrackListPageState = {
  songs: Track[];
  songCloseToLastRemoved?: Track;
  downloadedUris: string[];
};

export default function TrackListPage() {
  const { mopidy, online, setNotification } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<TrackListPageState>({ songs: [], downloadedUris: [] });
  const imgMaxEdge = useMaxEdge();

  // console.log(`[TrackListPage] online = ${online}:`, state.songs);

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
        // console.log(`[TrackListPage:handleSelection] song:\n`, song);
        sustain(play(mopidy, song.tlid), `Failed to play ${song.title}!`);
      } else {
        setState((old) => ({ ...old, error: 'Something is wrong with the selected song!' }));
      }
    },
    [mopidy, setState, sustain]
  );

  const handleDownload = useCallback(
    (song: Track) => {
      // console.log(`[TrackListPage:handleDownload] song:\n`, song);
      sustain(
        downloadTrack(song.uri).then((response) => {
          const formattedURI = formatFileURI(response.fileURI);
          setNotification(
            response.alreadyDownloaded
              ? `Already downloaded ${song.title} at ${formattedURI}`
              : `Downloaded ${song.title} to ${formattedURI}`
          );
          return {
            downloadedUris: [
              ...state.downloadedUris,
              ...(state.downloadedUris.includes(song.uri) ? [] : [song.uri]),
            ],
          };
        }),
        `Failed to download ${song.title}!`
      );
    },
    [setNotification, state.downloadedUris, sustain]
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
      widePage={true}
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<TrackListMenu sustain={sustain} />}
      disableSpinner={true}
    >
      <TrackList
        songs={state.songs}
        loading={state.loading}
        onRemove={handleRemove}
        onDownload={handleDownload}
        onClick={handleSelection}
        songCloseToLastRemoved={state.songCloseToLastRemoved}
        downloadedUris={state.downloadedUris}
      />
    </PageTemplate>
  );
}
