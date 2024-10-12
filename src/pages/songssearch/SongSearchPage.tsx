import PageTemplate from '../../templates/PageTemplate';
import { searchSongs } from '../../services/audio-db/songs-search';
import { useCallback, useContext, useEffect, useRef } from 'react';
import TextSearchButton from '../../components/button/TextSearchButton';
import { useNavigate } from 'react-router-dom';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import SongList from '../../components/list/SongList';
import { useMaxEdge } from '../../constants';
import useSongList, { RawSongsPageState } from '../../hooks/list/useSongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { AppContext } from '../../components/app/AppContext';
import { ScrollPosition } from '../../domain/scroll';
import { toQueryParams } from '../../lib/path-param-utils';
import { SetFeedbackState } from '../../lib/sustain';
import './SongSearchPage.scss';

type RawSongsSearchPageState = {
  draftExpression?: string | null;
} & RawSongsPageState;

type SongSearchCache = { searchExpression: string } & ScrollPosition & RawSongsSearchPageState;

function SongSearchPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { text: searchExpression, rand } = useURLQueryParams('text', 'rand');
  const { getCache, mergeCache } = useContext(AppContext);
  const cache = getCache('songs-search') as SongSearchCache;
  const {
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleInsert,
    scrollObserver,
    scrollTo,
    ...partialSongsListParam
  } = useSongList<RawSongsSearchPageState>('songs-search', {
    draftExpression: cache?.draftExpression
      ? cache?.draftExpression
      : cache?.searchExpression ?? searchExpression,
  });

  /* console.log(
    `[SongsSearchPage] searchExpression = ${searchExpression}, state:`,
    state
  );
  console.log(`[SongsSearchPage] cache:`, cache); */
  /* console.log(
    `[SongsSearchPage] songs:`,
    state.songs.map((it) => it.location.uri)
  ); */

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  const imgMaxEdge = useMaxEdge();

  // URI "searchExpression" param changed: search for the corresponding songs.
  useEffect(() => {
    if (searchExpression == cache?.searchExpression) {
      console.log(
        `[SongsSearchPage.useEffect/search] ${rand ? rand + ', ' : ''}search expression didn't change:`,
        searchExpression
      );
      return;
    }
    // console.log(`[SongsSearchPage.useEffect/search] ${rand ? rand + ', ' : ''}searchExpression = ${searchExpression}`);
    if (searchExpression) {
      console.log(
        `[SongsSearchPage.useEffect/search] ${rand ? rand + ', ' : ''}searching for:`,
        searchExpression
      );
      sustain(
        searchSongs(imgMaxEdge, searchExpression).then((songs) => {
          scrollTo(0);
          return setState((old) => ({ ...old, songs }));
        }),
        `Failed to search for ${searchExpression}!`
      );
    }
  }, [cache?.searchExpression, imgMaxEdge, rand, scrollTo, searchExpression, setState, sustain]);

  // scroll position after loading the search result
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      return;
    }
    console.log(`[SongsSearchPage] scrolling to ${cachedScrollTop} after loading the search result`);
    setTimeout(scrollTo, 0, cachedScrollTop);
    // scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // save the current state as navigation state
  useEffect(() => {
    if (!searchExpression) {
      return;
    }
    const stateBackup = {
      songs: state.songs,
      lastUsed: state.lastUsed,
      draftExpression: state.draftExpression,
      searchExpression,
    };
    mergeCache('songs-search', (old) => {
      /* console.log(
        `[SongsSearchPage:backup] scrollTop = ${(old as SongSearchCache)?.scrollTop}, backup:`,
        stateBackup
      ); */
      return { ...(old as object), ...stateBackup };
    });
  }, [mergeCache, searchExpression, state.draftExpression, state.lastUsed, state.songs]);

  const handleSearch = useCallback(() => {
    const draftExpression = state.draftExpression;
    if (!draftExpression) {
      setState((old) => ({ ...old, error: 'The search expression must not be empty!' }));
    } else {
      // console.log(`[SongsSearchPage.handleSearch] draftExpression:`, draftExpression);
      searchRef.current?.blur();
      mergeCache('songs-search', (old) => ({
        scrollTop: (old as SongSearchCache)?.scrollTop,
        searchExpression: '', // forces the search to run again
      }));
      navigate(`/songssearch?${toSongsSearchParams(draftExpression)}`, { replace: true });
    }
  }, [mergeCache, navigate, setState, state.draftExpression]);

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

function toSongsSearchParams(text: string) {
  return toQueryParams(['text', text], ['rand', `${Math.random()}`]);
}
