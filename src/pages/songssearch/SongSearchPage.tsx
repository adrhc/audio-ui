import PageTemplate from '../../templates/PageTemplate';
import { searchSongs } from '../../services/audio-db/songs-search';
import { useCallback, useEffect, useRef } from 'react';
import TextSearchButton from '../../components/button/TextSearchButton';
import { useNavigate } from 'react-router-dom';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import SongList from '../../components/list/SongList';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { SONG_SEARCH } from '../../hooks/cache/cache-names';
import { removeSearchExpression, toSongsSearchParams } from './SongSearchUtils';
import { SongSearchCache, SongSearchResult } from './model';
import './SongSearchPage.scss';

function SongSearchPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { search: searchExpression } = useURLQueryParams('search');
  const {
    state,
    sustain,
    setState,
    addSongThenPlay,
    addSongOrPlaylist,
    insertSongOrPlaylist,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
    ...useCachedSongsScrollableRest
    // the cache.draftExpression, if exists, it overwrites state's "draftExpression"!
    // "state" receives "searchExpression" from the cache despite the fact that it doesn't declare it!
  } = useCachedSongsScrollable<SongSearchResult>(SONG_SEARCH, { draftExpression: searchExpression });

  const cache = getCache() as SongSearchCache;

  /* console.log(`[SongsSearchPage] searchExpression = ${searchExpression}, state:`, state);
  console.log(`[SongsSearchPage] cache:`, cache); */

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const imgMaxEdge = useMaxEdge();
  const { draftExpression } = state;
  const songsIsEmpty = state.songs.length == 0;

  const doSearch = useCallback(
    (searchExpression: string, scrollTop?: boolean) => {
      console.log(`[SongsSearchPage.useEffect/search] searching for:`, searchExpression);
      sustain(
        searchSongs(imgMaxEdge, searchExpression).then((songs) => {
          if (scrollTop) {
            mergeCache((old) => ({ ...old, scrollTop: 0 }));
          }
          return { songs, draftExpression: searchExpression };
        }),
        `Failed to search for ${searchExpression}!`
      );
    },
    [imgMaxEdge, mergeCache, sustain]
  );

  // URL "search" param (aka, searchExpression) changed
  useEffect(() => {
    if (searchExpression) {
      doSearch(searchExpression, true);
    }
  }, [doSearch, searchExpression]);

  // scroll position after loading the search result
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (!songsIsEmpty) {
      scrollTo(cachedScrollTop);
    }
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  const curatedState: SongSearchResult = removeSearchExpression(
    removeLoadingAttributes(state as SongSearchCache)
  );
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...curatedState, searchExpression }));
  }, [mergeCache, searchExpression, curatedState]);

  const handleSearch = useCallback(() => {
    if (draftExpression) {
      if (draftExpression != cache.searchExpression) {
        navigate(`/songssearch?${toSongsSearchParams(draftExpression)}`, { replace: true });
      } else {
        doSearch(draftExpression);
      }
    } else {
      setState((old) => ({ ...old, error: 'The search expression must not be empty!' }));
    }
  }, [cache.searchExpression, doSearch, draftExpression, navigate, setState]);

  const handleDraftChange = useCallback(
    (draftExpression?: string) => setState((old) => ({ ...old, draftExpression })),
    [setState]
  );

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
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
        onClick={addSongThenPlay}
        onAdd={addSongOrPlaylist}
        onInsert={insertSongOrPlaylist}
        onScroll={scrollObserver}
        addManyDisabled={true}
        {...state}
        {...useCachedSongsScrollableRest}
      />
    </PageTemplate>
  );
}

export default SongSearchPage;
