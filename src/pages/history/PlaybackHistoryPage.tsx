import { useCallback, useContext, useEffect } from 'react';
import useSongList from '../../hooks/list/useSongList';
import { getHistory, getHistoryAfter, getHistoryBefore } from '../../services/audio-db/audio-db';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import {
  HistoryCache,
  RawPlaybackHistoryPageState,
  toPartialHistoryCache,
  toPartialState,
} from './history-utils';
import { AppContext } from '../../components/app/AppContext';
import { scrollTop } from '../../domain/scroll';
import { SetFeedbackState } from '../../lib/sustain';
import { useMaxEdge } from '../../constants';
import '/src/styles/wide-page.scss';

function PlaybackHistoryPage() {
  const { mopidy, getCache, mergeCache } = useContext(AppContext);
  const cache = getCache('history') as HistoryCache;
  const {
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleInsert,
    listRef,
    scrollObserver,
    scrollTo,
    currentSong,
  } = useSongList<RawPlaybackHistoryPageState>('history', {
    pageBeforeExists: cache?.pageBeforeExists,
    pageAfterExists: cache?.pageAfterExists,
  });
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[PlaybackHistoryPage] cachedScrollTop = ${cachedScrollTop}:`, { currentSong, ...state });

  const imgMaxEdge = useMaxEdge();

  // scroll position restoration at 1st page load
  useEffect(() => {
    console.log(`[PlaybackHistoryPage] scrolling to ${cachedScrollTop} at page load`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo]);

  // loading the history if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      // console.log(`[PlaybackHistoryPage.useEffect] history is already loaded!`);
      return;
    }
    console.log(`[PlaybackHistoryPage.useEffect] loading the history`);
    sustain(
      getHistory(mopidy, imgMaxEdge).then((it) => ({ ...toPartialState(0, it) })),
      `Failed to load the history!`
    );
  }, [imgMaxEdge, mopidy, songsIsEmpty, sustain]);

  // scroll after loading the history
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty || state.pageBeforeExists) {
      return;
    }
    console.log(`[PlaybackHistoryPage] scrolling to ${cachedScrollTop} after loading the history`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, state.pageBeforeExists]);

  // cache the current state
  useEffect(() => {
    if (!state.songs.length) {
      // console.log(`[PlaybackHistoryPage.useEffect] no songs to backup!`);
      return;
    }
    const partialHistoryCache = toPartialHistoryCache({
      songs: state.songs,
      lastUsed: state.lastUsed,
      before: state.before,
      after: state.after,
      pageBeforeExists: state.pageBeforeExists,
      pageAfterExists: state.pageAfterExists,
      completePageSize: state.completePageSize,
      prevSongsCount: state.prevSongsCount,
    });
    // console.log(`[PlaybackHistoryPage.useEffect] backing the state:`, partialHistoryCache);
    mergeCache('history', (old) => {
      const backup = partialHistoryCache.pageBeforeExists
        ? { ...(old as object), ...partialHistoryCache }
        : { scrollTop: scrollTop(old), ...partialHistoryCache };
      console.log(`[PlaybackHistoryPage] partialHistoryCache:`, backup);
      return backup;
    });
  }, [
    mergeCache,
    state.after,
    state.before,
    state.completePageSize,
    state.lastUsed,
    state.pageAfterExists,
    state.pageBeforeExists,
    state.prevSongsCount,
    state.songs,
  ]);

  const goToNextPage = useCallback(() => {
    // console.log(`[PlaybackHistoryPage.goToNextPage]`);
    if (state.songs.length < state.completePageSize) {
      sustain(
        getHistory(mopidy, imgMaxEdge).then((it) => {
          console.log(`[PlaybackHistoryPage.goToNextPage] scrollTo set to zero`);
          mergeCache('history', (old) => ({ ...(old as object), scrollTop: 0 }));
          scrollTo(0); // intended to reset the scroll position to "naturally" render it at 0
          setState((old) => ({ ...old, ...toPartialState(0, it) }));
        }),
        `Failed to load the history!`
      );
    } else if (state.after) {
      sustain(
        getHistoryAfter(mopidy, imgMaxEdge, state.after).then((it) => {
          console.log(`[PlaybackHistoryPage.goToNextPage] scrollTo set to zero`);
          mergeCache('history', (old) => ({ ...(old as object), scrollTop: 0 }));
          scrollTo(0); // intended to reset the scroll position to "naturally" render it at 0
          setState((old) => ({
            ...old,
            ...toPartialState(old.prevSongsCount + old.completePageSize, it),
          }));
        }),
        `Failed to load the history!`
      );
    }
  }, [imgMaxEdge, mergeCache, mopidy, scrollTo, setState, state.after, state.completePageSize, state.songs.length, sustain]);

  const goToPreviousPage = useCallback(() => {
    if (!state.before) {
      return;
    }
    // console.log(`[PlaybackHistoryPage.goToPreviousPage]`);
    sustain(
      getHistoryBefore(mopidy, imgMaxEdge, state.before).then((it) => {
        mergeCache('history', (old) => ({ ...(old as object), scrollTop: 0 }));
        setState((old) => ({
          ...old,
          ...toPartialState(Math.max(0, old.prevSongsCount - old.completePageSize), it),
        }));
      }),
      `Failed to load the history!`
    );
  }, [imgMaxEdge, mergeCache, mopidy, setState, state.before, sustain]);

  return (
    <PageTemplate
      className="wide-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        prevSongsCount={state.prevSongsCount}
        songs={state.songs}
        loading={state.loading}
        currentSong={currentSong}
        onAdd={handleAdd}
        onInsert={handleInsert}
        onClick={handleSelection}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        pageBeforeExists={state.pageBeforeExists}
        pageAfterExists={state.pageAfterExists}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default PlaybackHistoryPage;
