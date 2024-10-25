import PageTemplate from '../../templates/PageTemplate';
import { searchSelectableSongs } from '../../infrastructure/audio-db/search';
import { useCallback, useContext, useEffect, useRef } from 'react';
import TextSearchButton from '../../components/button/TextSearchButton';
import { useParams } from 'react-router-dom';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import SongList from '../../components/list/SongList';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { SetFeedbackState } from '../../lib/sustain/types';
import { removeLoadingAttributes } from '../../lib/sustain/sustain';
import { plCacheName, plEditSearchCacheName } from '../../hooks/cache/cache-names';
import { SongSearchCache } from '../songssearch/model';
import PageTitle from '../../components/PageTitle';
import { SelectableSong, toSelectableSong } from '../../domain/song';
import CreateConfirmButtonMenu from '../../components/menu/CreateConfirmButtonMenu';
import { updateLocalPlaylist } from '../../infrastructure/audio-db/playlist/playlist';
import { AppContext } from '../../hooks/AppContext';
import { getNoImgPlContent } from '../../infrastructure/audio-ws/playlist/playlist';
import { toAllSelected, toNoneSelected } from '../../domain/Selectable';
import { getSelectablePlContent } from '../../infrastructure/playlist';
import '../songssearch/SongSearchPage.scss';

function PlaylistEditFromSearchPage() {
  const { uri } = useParams();
  const { title } = useURLQueryParams('title');
  const searchRef = useRef<HTMLInputElement>(null);
  const { clearCache } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
    ...useCachedSongsScrollableRest
    // the cache.draftExpression, if exists, it overwrites state's "draftExpression"!
    // "state" receives "searchExpression" from the cache despite the fact that it doesn't declare it!
  } = useCachedSongsScrollable<SongSearchCache>(plEditSearchCacheName(uri), { searchExpression: '' });

  const { searchExpression, songs } = state;
  const cache = getCache();

  /* console.log(`[PlaylistEditFromSearchPage] searchExpression = ${searchExpression}, state:`, state);
  console.log(`[PlaylistEditFromSearchPage] cache:`, cache); */

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const imgMaxEdge = useMaxEdge();
  const { draftExpression } = state;
  const songsIsEmpty = state.songs.length == 0;

  const loadSelectablePlContent = useCallback(() => {
    if (!uri) {
      return;
    }
    console.log(`[PlaylistEditFromSearchPage.loadSelectablePlContent] loading ${title} playlist`);
    sustain(
      getSelectablePlContent(imgMaxEdge, uri).then(
        (songs) => ({ songs, searchExpression }) as Partial<SongSearchCache>
      ),
      `Failed to load ${title}!`
    );
  }, [imgMaxEdge, searchExpression, sustain, title, uri]);

  const doSearchSelectableSongs = useCallback(
    (searchExpression: string, isNewSearch?: boolean) => {
      if (!uri) {
        return;
      }
      console.log(`[PlaylistEditFromSearchPage.loadSelectableSongs] searching for:`, searchExpression);
      sustain(
        searchSelectableSongs(imgMaxEdge, uri, searchExpression).then((songs) => {
          if (isNewSearch) {
            mergeCache((old) => ({ ...old, scrollTop: 0 }));
          }
          return { songs, searchExpression };
        }),
        `Failed to search for ${searchExpression}!`
      );
    },
    [imgMaxEdge, mergeCache, sustain, uri]
  );

  const reloadPlaylist = useCallback(() => {
    if (!uri) {
      return;
    }
    sustain(
      getNoImgPlContent(uri).then((playlist) =>
        setState((old) => ({ ...old, songs: old.songs.map((s) => toSelectableSong(playlist, s)) }))
      ),
      `Failed to load ${title}!`
    );
  }, [uri, sustain, setState, title]);

  useEffect(() => {
    if (songsIsEmpty && !searchExpression) {
      loadSelectablePlContent();
    }
  }, [songsIsEmpty, searchExpression, loadSelectablePlContent]);

  // scroll position after loading the search result
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (!songsIsEmpty) {
      scrollTo(cachedScrollTop);
    }
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  const curatedState = removeLoadingAttributes(state as SongSearchCache);
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...curatedState }));
  }, [mergeCache, curatedState]);

  const handleSearch = useCallback(() => {
    console.log(`[PlaylistEditFromSearchPage.handleSearch] draftExpression:`, draftExpression);
    searchRef.current?.blur();
    if (draftExpression) {
      doSearchSelectableSongs(draftExpression, draftExpression != searchExpression);
    } else {
      loadSelectablePlContent();
    }
  }, [draftExpression, searchExpression, doSearchSelectableSongs, loadSelectablePlContent]);

  const handleDraftChange = useCallback(
    (draftExpression?: string) => setState((old) => ({ ...old, draftExpression: draftExpression?.trim() })),
    [setState]
  );

  const handleSelection = useCallback(
    (newSelection: SelectableSong) => {
      setState((old) => ({
        ...old,
        songs: old.songs.map((oldSelection) =>
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
        updateLocalPlaylist(uri, songs).then(() => clearCache(plCacheName(uri))),
        'Failed to save the selection!'
      );
    }
  }, [uri, sustain, songs, clearCache]);

  const removeAll = useCallback(() => {
    setState((old) => ({ ...old, songs: toNoneSelected(old.songs) }));
  }, [setState]);

  const selectAll = useCallback(() => {
    setState((old) => ({ ...old, songs: toAllSelected(old.songs) }));
  }, [setState]);

  if (!uri) {
    return <PageTitle>The uri for the playlist to edit is missing!</PageTitle>;
  }

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      title={title}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<CreateConfirmButtonMenu onAccept={persistSelection} acceptDisabled={!uri || !songs.length} />}
      disableSpinner={true}
    >
      <TextSearchButton
        placeholder="Search for songs"
        required={true}
        text={draftExpression ?? ''}
        onChange={handleDraftChange}
        onSearch={handleSearch}
        autoFocus={songsIsEmpty}
        searchRef={searchRef}
      />
      <SongList
        onReloadList={reloadPlaylist}
        onSelect={handleSelection}
        onMinus={removeAll}
        onPlus={selectAll}
        onScroll={scrollObserver}
        addManyDisabled={true}
        {...state}
        {...useCachedSongsScrollableRest}
      />
    </PageTemplate>
  );
}

export default PlaylistEditFromSearchPage;
