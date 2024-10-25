import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../hooks/AppContext';
import { LocationSelection, MediaLocation, filterByMediaLocations } from '../../domain/media-location';
import { UriPlAllocationResult, getChanged } from '../../domain/UriPlAllocationResult';
import { useSustainableState } from '../../hooks/useSustainableState';
import { getLocalLibrary } from '../../infrastructure/audio-db/library/library';
import PageTemplate from '../../templates/PageTemplate';
import LocationSelectionList from '../../components/list/LocationSelectionList';
import CreateConfirmButtonMenu from '../../components/menu/CreateConfirmButtonMenu';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import { useGoBack } from '../../hooks/useGoBack';
import { SetFeedbackState } from '../../lib/sustain/types';
import PageTitle from '../../components/PageTitle';
import { filterSelected } from '../../domain/Selectable';
import { toError } from './pl-editor-utils';
import { toPlCacheName } from '../../hooks/cache/cache-names';
import { updateManyLocalPlaylists } from '../../infrastructure/audio-db/playlist/playlist';
import '/src/styles/wide-page.scss';

interface PlaylistToEditSelectorPageState {
  selections: LocationSelection[];
}

function PlaylistToSongAllocatorPage() {
  const goBack = useGoBack();
  const { uri } = useParams();
  const { title } = useURLQueryParams('title');
  const decodedUri = uri ? decodeURIComponent(uri) : uri;
  const decodedTitle = title ? decodeURIComponent(title) : title;
  const { online, clearCache } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<PlaylistToEditSelectorPageState>({ selections: [] });
  const { loading, selections } = state;
  /* console.log(
    `[SongPlaylistsEditorPage]\nuri: ${uri}\ndecodedUri: ${decodedUri}\ntitle: ${title}\ndecodedTitle: ${decodedTitle}`
  ); */

  useEffect(() => {
    if (!decodedUri || !online) {
      return;
    }
    console.log(`[TrackListPage:online] loading the track list`);
    sustain(
      getLocalLibrary(decodedUri)?.then((selections) => ({ selections })),
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
    (selections: LocationSelection[], result: UriPlAllocationResult) => {
      filterByMediaLocations(getChanged(result), selections)
        .map(toPlCacheName)
        .forEach((cn) => clearCache(cn));
      if (result.failedToChange.length) {
        return toError<PlaylistToEditSelectorPageState>(result.failedToChange);
      } else {
        // console.log(`[SongPlaylistsEditorPage] selections: `, selections);
        goBack();
      }
    },
    [goBack, clearCache]
  );

  const allocate = useCallback(() => {
    sustain(
      updateManyLocalPlaylists(decodedUri!, decodedTitle, filterSelected(selections)).then((result) =>
        handleChangeResult(selections, result)
      ),
      'Failed to save the selection!'
    );
  }, [decodedTitle, decodedUri, handleChangeResult, selections, sustain]);

  if (!decodedUri) {
    return <PageTitle>The song to search the locations for is missing!</PageTitle>;
  }

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      title={<PageTitle>{decodedTitle}</PageTitle>}
      hideTop={true}
      bottom={
        <CreateConfirmButtonMenu
          addPage="/add-playlist"
          onAccept={allocate}
          acceptDisabled={!decodedUri || !online || !selections.length}
        />
      }
      disableSpinner={true}
    >
      <LocationSelectionList loading={loading} selections={selections} onClick={selectLocation} />
    </PageTemplate>
  );
}

export default PlaylistToSongAllocatorPage;
