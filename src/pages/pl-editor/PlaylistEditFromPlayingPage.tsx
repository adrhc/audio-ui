import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSustainableState } from '../../hooks/useSustainableState';
import CreateConfirmButtonMenu from '../../components/menu/CreateConfirmButtonMenu';
import PageTitle from '../../components/PageTitle';
import { SetFeedbackState } from '../../lib/sustain';
import PageTemplate from '../../templates/PageTemplate';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import { AppContext } from '../../hooks/AppContext';
import { getSelectableTrackSongs } from '../../services/tracks-load';
import { useMaxEdge } from '../../constants';
import { SelectableTrackSong } from '../../domain/track';
import TrackList from '../../components/list/TrackList';
import { updateDiskPlContent } from '../../services/audio-db/audio-db';
import { useGoBack } from '../../hooks/useGoBack';
import ListItemMinusPlusMenu from '../../components/list/ListItemMinusPlusMenu';
import { CURRENT_PLAY_TO_PL_ALLOCATOR_PAGE, plCacheName } from '../../hooks/cache/cache-names';
import useCachedPositionScrollable from '../../hooks/scrollable/useCachedPositionScrollable';
import '/src/styles/wide-page.scss';
import './PlaylistEditFromPlayingPage.scss';

interface PlEditFromCurrentPlayPageState {
  selections: SelectableTrackSong[];
}

function PlaylistEditFromPlayingPage() {
  const { uri } = useParams();
  const { title } = useURLQueryParams('title');
  // const decodedUri = uri ? decodeURIComponent(uri) : uri;
  // const decodedTitle = title ? decodeURIComponent(title) : title;
  const { mopidy, online, clearCache } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<PlEditFromCurrentPlayPageState>({ selections: [] });
  const { loading, selections } = state;
  console.log(`[PlaylistEditFromPlayingPage]\nuri: ${uri}\ntitle: ${title}`);
  const imgMaxEdge = useMaxEdge();
  const goBack = useGoBack();

  const { getScrollPosition, scrollTo, listRef, scrollObserver } = useCachedPositionScrollable(
    CURRENT_PLAY_TO_PL_ALLOCATOR_PAGE
  );

  useEffect(() => {
    if (uri && online) {
      console.log(`[PlaylistEditFromPlayingPage:online] loading the track list`);
      sustain(
        getSelectableTrackSongs(mopidy, uri, imgMaxEdge)?.then((selections) => ({ selections })),
        "Can't load the track list!"
      );
    }
  }, [imgMaxEdge, mopidy, online, sustain, uri]);

  // scroll after loading the library
  const scrollPosition = getScrollPosition();
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (selections.length) {
      console.log(`[PlaylistEditFromPlayingPage.useEffect] scrolling to ${scrollPosition}`);
      // setTimeout(scrollTo, 0, cachedScrollTop);
      scrollTo(scrollPosition);
    } else {
      console.log(`[PlaylistEditFromPlayingPage.useEffect] there are no songs scheduled to play!`);
      return;
    }
  }, [scrollPosition, scrollTo, selections.length]);

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
          clearCache(plCacheName(uri));
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
    return <PageTitle>The uri for the playlist to edit is missing!</PageTitle>;
  }

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      title={<PageTitle>{title}</PageTitle>}
      hideTop={true}
      bottom={
        <CreateConfirmButtonMenu
          onAccept={persistSelection}
          acceptDisabled={!uri || !online || !selections.length}
        />
      }
      disableSpinner={true}
    >
      <TrackList
        className="pl-edit-current-play-list"
        songs={selections}
        loading={loading}
        onSelect={handleSelection}
        menu={selections.length && <ListItemMinusPlusMenu onMinus={removeAll} onPlus={selectAll} />}
        listRef={listRef}
        onScroll={scrollObserver}
      />
    </PageTemplate>
  );
}

export default PlaylistEditFromPlayingPage;
