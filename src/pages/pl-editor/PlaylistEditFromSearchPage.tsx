import PageTemplate from '../../templates/PageTemplate';
import { searchSelectableSongs } from '../../services/audio-db/songs-search';
import { useCallback, useContext, useEffect, useRef } from 'react';
import TextSearchButton from '../../components/button/TextSearchButton';
import { useParams } from 'react-router-dom';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import SongList from '../../components/list/SongList';
import { useMaxEdge } from '../../constants';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { plCacheName, plEditSearchCacheName } from '../../hooks/cache/cache-names';
import { SongSearchCache } from '../songssearch/model';
import PageTitle from '../../components/PageTitle';
import { SelectableSong, toSelectableSong } from '../../domain/song';
import CreateConfirmButtonMenu from '../../components/menu/CreateConfirmButtonMenu';
import { loadSelectablePlaylist, updateDiskPlContent } from '../../services/audio-db/audio-db';
import { AppContext } from '../../hooks/AppContext';
import { getNoImgPlContent } from '../../services/audio-ws/audio-ws';
import { toAllSelected, toNoneSelected } from '../../domain/Selectable';
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

  const showSelectablePlaylist = useCallback(() => {
    if (!uri) {
      return;
    }
    console.log(`[PlaylistEditFromSearchPage.showSelectablePlaylist] loading ${title} playlist`);
    sustain(
      loadSelectablePlaylist(imgMaxEdge, uri).then(
        (songs) => ({ songs, searchExpression }) as Partial<SongSearchCache>
      ),
      `Failed to load ${title}!`
    );
  }, [imgMaxEdge, searchExpression, sustain, title, uri]);

  const doSearch = useCallback(
    (searchExpression?: string | null, scrollTop?: boolean) => {
      if (!uri) {
        return;
      } else if (searchExpression) {
        console.log(`[PlaylistEditFromSearchPage.doSearch] searching for:`, searchExpression);
        sustain(
          searchSelectableSongs(imgMaxEdge, uri, searchExpression).then((songs) => {
            if (scrollTop) {
              mergeCache((old) => ({ ...old, scrollTop: 0 }));
            }
            return { songs, searchExpression };
          }),
          `Failed to search for ${searchExpression}!`
        );
      } else {
        console.log(`[PlaylistEditFromSearchPage.doSearch]`);
        showSelectablePlaylist();
      }
    },
    [imgMaxEdge, mergeCache, showSelectablePlaylist, sustain, uri]
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
      showSelectablePlaylist();
    }
  }, [songsIsEmpty, searchExpression, showSelectablePlaylist]);

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
    doSearch(draftExpression, draftExpression != searchExpression);
  }, [searchExpression, doSearch, draftExpression]);

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
      console.log(`[PlaylistEditFromSearchPage.persistSelection] searchExpression:`, searchExpression);
      sustain(
        updateDiskPlContent(uri, songs).then(() => {
          clearCache(plCacheName(uri));
          /* if (!searchExpression) {
            return loadSelectablePlaylist(imgMaxEdge, uri).then((songs) => ({ songs }));
          } */
        }),
        'Failed to save the selection!'
      );
    }
  }, [uri, sustain, songs, clearCache, searchExpression]);

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
