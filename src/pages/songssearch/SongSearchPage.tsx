import PageTemplate from '../../templates/PageTemplate';
import { searchSongs } from '../../services/audio-db/songs-search';
import { useCallback, useEffect, useRef } from 'react';
import TextSearchButton from '../../components/button/TextSearchButton';
import { useNavigate } from 'react-router-dom';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import SongList from '../../components/list/SongList';
import { useMaxEdge } from '../../constants';
import useSongList, { ThinSongListState } from '../../hooks/list/useSongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { toQueryParams } from '../../lib/path-param-utils';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { ScrollPosition } from '../../hooks/list/useScrollableCachedList';
import './SongSearchPage.scss';

interface RawSongsSearchPageState extends ThinSongListState {
  draftExpression?: string | null;
}

interface SongSearchCache extends ScrollPosition, RawSongsSearchPageState {
  searchExpression: string;
}

function SongSearchPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { search: searchExpression, rand } = useURLQueryParams('search', 'rand');
  const {
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleInsert,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
    ...partialSongsListParam
    // the cache, if exists, it overwrites "draftExpression: searchExpression" with its draftExpression!
    // "state" receives searchExpression from the cache despite the fact that it doesn't declare it!
  } = useSongList<RawSongsSearchPageState>('songs-search', { draftExpression: searchExpression });

  const cache = getCache() as SongSearchCache;

  // console.log(`[SongsSearchPage] searchExpression = ${searchExpression}, state:`, state);
  // console.log(`[SongsSearchPage] cache:`, cache);

  /* console.log(
    `[SongsSearchPage] songs:`,
    state.songs.map((it) => it.location.uri)
  ); */

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  const imgMaxEdge = useMaxEdge();
  const { draftExpression } = state;

  // URL "search" param changed: search for the corresponding songs.
  useEffect(() => {
    if (searchExpression) {
      // console.log(`[SongsSearchPage.useEffect/search] searching for:`, searchExpression);
      sustain(
        searchSongs(imgMaxEdge, searchExpression).then((songs) => {
          if (searchExpression != cache?.searchExpression) {
            mergeCache((old) => ({ ...old, scrollTop: 0 }));
          }
          return { songs, draftExpression: searchExpression };
        }),
        `Failed to search for ${searchExpression}!`
      );
    }
  }, [
    cache?.searchExpression,
    imgMaxEdge,
    mergeCache,
    searchExpression,
    setState,
    songsIsEmpty,
    sustain,
    // "rand" is used to force the search at page load even when the searchExpression
    // didn't change; it is used because even if the search criteria is the same the
    // result might differ because, e.g. YouTube database might meanwhile changed.
    rand,
  ]);

  // scroll position after loading the search result
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (!songsIsEmpty) {
      // console.log(`[SongsSearchPage.useEffect] scrolling to ${cachedScrollTop}`);
      // setTimeout(scrollTo, 0, cachedScrollTop);
      scrollTo(cachedScrollTop);
    }
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state), searchExpression }));
  }, [mergeCache, searchExpression, state]);

  const handleSearch = useCallback(() => {
    if (draftExpression) {
      // console.log(`[SongsSearchPage.handleSearch] draftExpression:`, draftExpression);
      navigate(`/songssearch?${toSongsSearchParams(draftExpression)}`, { replace: true });
    } else {
      setState((old) => ({ ...old, error: 'The search expression must not be empty!' }));
    }
  }, [draftExpression, navigate, setState]);

  const handleDraftChange = useCallback(
    (draftExpression?: string) => {
      // console.log(`[SongsSearchPage:handleSearchChange] draftExpression:`, draftExpression);
      setState((old) => ({ ...old, draftExpression }));
    },
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
        text={state.draftExpression ?? ''}
        onChange={handleDraftChange}
        onSearch={handleSearch}
        autoFocus={state.songs.length == 0}
        searchRef={searchRef}
      />
      <SongList
        songs={state.songs}
        loading={state.loading}
        lastUsed={state.lastUsed}
        onClick={handleSelection}
        onAdd={handleAdd}
        onInsert={handleInsert}
        onScroll={scrollObserver}
        {...partialSongsListParam}
      />
    </PageTemplate>
  );
}

export default SongSearchPage;

function toSongsSearchParams(search: string) {
  return toQueryParams(['search', search], ['rand', `${Math.random()}`]);
}
