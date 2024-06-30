import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../components/app/AppContext';
import { LocationSelection, MediaLocation, filterSelected } from '../domain/media-location';
import { LoadingStateOrProvider, useSustainableState } from '../hooks/useSustainableState';
import { getDiskPlaylists, updateUriPlaylists } from '../services/audio-db/audio-db';
import { Stack, Typography } from '@mui/material';
import PageTemplate from '../templates/PageTemplate';
import LocationsSelectionList from '../components/list/LocationsSelectionList';
import CreateConfirmButtonMenu from '../components/menu/CreateConfirmButtonMenu';
import { useURLQueryParams } from '../hooks/useURLSearchParams';
import { useGoBack } from '../hooks/useGoBack';
import { SetFeedbackState } from '../lib/sustain';
import '../templates/SongListPage.scss';

interface SongPlaylistsEditorPageState {
  selections: LocationSelection[];
}

function SongPlaylistsEditorPage() {
  const goBack = useGoBack();
  const { uri } = useParams();
  const { title } = useURLQueryParams('title');
  const decodedUri = uri ? decodeURIComponent(uri) : uri;
  const decodedTitle = title ? decodeURIComponent(title) : title;
  const { online } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<SongPlaylistsEditorPageState>({ selections: [] });
  /* console.log(
    `[SongPlaylistsEditorPage]\nuri: ${uri}\ndecodedUri: ${decodedUri}\ntitle: ${title}\ndecodedTitle: ${decodedTitle}`
  ); */

  useEffect(() => {
    if (!decodedUri || !online) {
      return;
    }
    console.log(`[TrackListPage:online] loading the track list`);
    sustain(
      getDiskPlaylists(decodedUri)?.then((selections) => ({ selections })),
      "Can't load the locations!"
    );
  }, [decodedUri, online, sustain]);

  const selectLocation = useCallback(
    (pl: MediaLocation) => {
      setState((old) => ({
        ...old,
        selections: old.selections.map((mpl) =>
          mpl.uri == pl.uri ? { ...pl, selected: !mpl.selected } : mpl
        ),
      }));
    },
    [setState]
  );

  const handleChangeResult = useCallback(
    (failedToChange: MediaLocation[]) => {
      if (failedToChange.length) {
        return toError(failedToChange);
      } else {
        goBack();
      }
    },
    [goBack]
  );

  const allocate = useCallback(() => {
    sustain(
      updateUriPlaylists(decodedUri!, decodedTitle, filterSelected(state.selections)).then(
        handleChangeResult
      ),
      'Failed to save the selection!'
    );
  }, [decodedTitle, decodedUri, handleChangeResult, state.selections, sustain]);

  if (!decodedUri) {
    return <Typography variant="h6">The song to search the locations for is missing!</Typography>;
  }

  return (
    <PageTemplate
      className="song-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={
        <CreateConfirmButtonMenu
          addPage="/add-playlist"
          onAccept={allocate}
          acceptDisabled={!decodedUri || !online}
        />
      }
    >
      <Stack className="songs-wrapper">
        <LocationsSelectionList selections={state.selections} onClick={selectLocation} />
      </Stack>
    </PageTemplate>
  );
}

export default SongPlaylistsEditorPage;

function toError(
  failedToChange: MediaLocation[]
): Partial<LoadingStateOrProvider<SongPlaylistsEditorPageState>> {
  return { error: `Failed to change ${failedToChange.map((it) => it.title).join(',')}!` };
}
