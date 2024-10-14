import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSustainableState } from '../../hooks/useSustainableState';
import CreateConfirmButtonMenu from '../../components/menu/CreateConfirmButtonMenu';
import PageTitle from '../../components/PageTitle';
import { SetFeedbackState } from '../../lib/sustain';
import PageTemplate from '../../templates/PageTemplate';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import { AppContext } from '../../hooks/AppContext';
import { getSelectableTrackSongs } from '../../services/track-song';
import { useMaxEdge } from '../../constants';
import { SelectableTrackSong } from '../../domain/track-song';
import TrackList from '../tracks/TrackList';
import { updateDiskPlContent } from '../../services/audio-db/audio-db';
import { useGoBack } from '../../hooks/useGoBack';
import { plContentCacheName } from '../local-playlists/LocalPlContentUtils';
import ListItemMinusPlusMenu from '../../components/list/ListItemMinusPlusMenu';
import '/src/styles/wide-page.scss';
import './PlEditFromCurrentPlayPage.scss';

interface PlEditFromCurrentPlayPageState {
  selections: SelectableTrackSong[];
}

function PlEditFromCurrentPlayPage() {
  const { uri } = useParams();
  const { title } = useURLQueryParams('title');
  // const decodedUri = uri ? decodeURIComponent(uri) : uri;
  // const decodedTitle = title ? decodeURIComponent(title) : title;
  const { mopidy, online, clearCache } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<PlEditFromCurrentPlayPageState>({ selections: [] });
  const { loading, selections } = state;
  console.log(`[PlEditFromCurrentPlayPage]\nuri: ${uri}\ntitle: ${title}`);
  const imgMaxEdge = useMaxEdge();
  const goBack = useGoBack();

  useEffect(() => {
    if (uri && online) {
      console.log(`[TrackListPage:online] loading the track list`);
      sustain(
        getSelectableTrackSongs(mopidy, uri, imgMaxEdge)?.then((selections) => ({ selections })),
        "Can't load the track list!"
      );
    }
  }, [imgMaxEdge, mopidy, online, sustain, uri]);

  const handleSelection = useCallback(
    (newSelection: SelectableTrackSong) => {
      setState((old) => ({
        ...old,
        selections: old.selections.map((oldSelection) =>
          oldSelection.uri == newSelection.uri
            ? { ...newSelection, selected: !oldSelection.selected }
            : oldSelection
        ),
      }));
    },
    [setState]
  );

  const persistSelection = useCallback(() => {
    if (uri) {
      sustain(
        updateDiskPlContent(uri, selections).then(() => {
          clearCache(plContentCacheName(uri));
          goBack();
        }),
        'Failed to save the selection!'
      );
    }
  }, [clearCache, goBack, selections, sustain, uri]);

  const removeAll = useCallback(() => {
    setState((old) => ({ ...old, selections: old.selections.map((it) => ({ ...it, selected: false })) }));
  }, [setState]);

  const selectAll = useCallback(() => {
    setState((old) => ({ ...old, selections: old.selections.map((it) => ({ ...it, selected: true })) }));
  }, [setState]);

  if (!uri) {
    return <PageTitle>The playlist to edit is wrong!</PageTitle>;
  }

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      title={<PageTitle>{title}</PageTitle>}
      hideTop={true}
      bottom={
        <CreateConfirmButtonMenu onAccept={persistSelection} acceptDisabled={!uri || !online || !selections.length} />
      }
      disableSpinner={true}
    >
      <TrackList
        className="pl-edit-current-play-list"
        songs={selections}
        loading={loading}
        onSelect={handleSelection}
        menu={<ListItemMinusPlusMenu onMinus={removeAll} onPlus={selectAll} />}
      />
    </PageTemplate>
  );
}

export default PlEditFromCurrentPlayPage;
