import { useCallback, useContext, useEffect } from 'react';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import {
  getHistory,
  getHistoryAfter,
  getHistoryBefore,
  removeFromHistory,
} from '../../infrastructure/audio-db/history/history';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { RawPlaybackHistoryPageState, toRawPlaybackHistoryPageState } from './utils';
import { AppContext } from '../../hooks/AppContext';
import { SetFeedbackState } from '../../lib/sustain/types';
import { removeLoadingProps } from '../../lib/sustain/types';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import { PLAYLIST_HISTORY } from '../../hooks/cache/cache-names';
import { Song } from '../../domain/song';

function PlaybackHistoryPage() {
  const { mopidy } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    addSongThenPlay,
    addSongOrPlaylist,
    insertSongOrPlaylist,
    listRef,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
  } = useCachedSongsScrollable<RawPlaybackHistoryPageState>(PLAYLIST_HISTORY);
  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[PlaybackHistoryPage] cachedScrollTop = ${cachedScrollTop}:`, state);

  const imgMaxEdge = useMaxEdge();

  // scroll position restoration at 1st page load
  useEffect(() => {
    console.log(`[PlaybackHistoryPage.useEffect] scrolling to ${cachedScrollTop} at page load`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo]);

  // loading the history if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      console.log(`[PlaybackHistoryPage.useEffect] loading 1st history page`);
      sustain(
        getHistory(mopidy, imgMaxEdge).then((hp) => toRawPlaybackHistoryPageState(0, hp)),
        `Failed to load the history!`
      );
    }
  }, [imgMaxEdge, mopidy, songsIsEmpty, sustain]);

  // scroll after loading the history
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty || state.pageBeforeExists) {
      return;
    }
    console.log(`[PlaybackHistoryPage.useEffect] scrolling to ${cachedScrollTop} after loading the history`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, state.pageBeforeExists]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => {
      const backup = { ...old, ...removeLoadingProps(state) };
      console.log(`[PlaybackHistoryPage.useEffect/mergeCache] partialHistoryCache:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const goToNextPage = useCallback(() => {
    // console.log(`[PlaybackHistoryPage.goToNextPage]`);
    if (state.songs.length < state.completePageSize) {
      sustain(
        getHistory(mopidy, imgMaxEdge).then((hp) => {
          console.log(`[PlaybackHistoryPage.goToNextPage/getHistory] scrollTo set to zero`);
          mergeCache((old) => ({ ...old, scrollTop: 0 }));
          scrollTo(0); // intended to reset the scroll position to "naturally" render it at 0
          setState((old) => ({ ...old, ...toRawPlaybackHistoryPageState(0, hp) }));
        }),
        `Failed to load the next history page!`
      );
    } else if (state.after) {
      sustain(
        getHistoryAfter(mopidy, imgMaxEdge, state.after).then((hp) => {
          console.log(`[PlaybackHistoryPage.goToNextPage/getHistoryAfter] scrollTo set to zero`);
          mergeCache((old) => ({ ...old, scrollTop: 0 }));
          scrollTo(0); // intended to reset the scroll position to "naturally" render it at 0
          setState((old) => ({
            ...old,
            ...toRawPlaybackHistoryPageState(old.prevSongsCount + old.completePageSize, hp),
          }));
        }),
        `Failed to load the next history page!`
      );
    }
  }, [
    imgMaxEdge,
    mergeCache,
    mopidy,
    scrollTo,
    setState,
    state.after,
    state.completePageSize,
    state.songs.length,
    sustain,
  ]);

  const goToPreviousPage = useCallback(() => {
    console.log(`[PlaybackHistoryPage.goToPreviousPage] before:`, state.before);
    if (state.before) {
      sustain(
        getHistoryBefore(mopidy, imgMaxEdge, state.before).then((hp) => {
          console.log(`[PlaybackHistoryPage.goToPreviousPage/getHistoryBefore] before:`, state.before);
          mergeCache((old) => ({ ...old, scrollTop: 0 }));
          setState((old) => ({
            ...old,
            ...toRawPlaybackHistoryPageState(Math.max(0, old.prevSongsCount - old.completePageSize), hp),
          }));
        }),
        `Failed to load the previous history page!`
      );
    } else {
      sustain(
        getHistory(mopidy, imgMaxEdge).then((hp) => {
          console.log(`[PlaybackHistoryPage.goToPreviousPage/getHistory] scrollTo set to zero`);
          mergeCache((old) => ({ ...old, scrollTop: 0 }));
          scrollTo(0); // intended to reset the scroll position to "naturally" render it at 0
          setState((old) => ({ ...old, ...toRawPlaybackHistoryPageState(0, hp) }));
        }),
        `Failed to load the next history page!`
      );
    }
  }, [imgMaxEdge, mergeCache, mopidy, setState, state.before, sustain]);

  const onDelete = useCallback(
    (song: Song) => {
      sustain(
        removeFromHistory(song.uri).then(() =>
          setState((old) => ({
            ...old,
            songs: old.songs.filter((s) => s.uri !== song.uri),
            lastUsed: old.lastUsed?.uri === song.uri ? null : old.lastUsed,
          }))
        ),
        `Failed to remove ${song.title} from history!`,
        false
      );
    },
    [setState, sustain]
  );

  return (
    <PageTemplate
      widePage={true}
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        prevSongsCount={state.prevSongsCount}
        songs={state.songs}
        loading={state.loading}
        onAdd={addSongOrPlaylist}
        onInsert={insertSongOrPlaylist}
        onDelete={onDelete}
        onClick={addSongThenPlay}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        pageBeforeExists={true}
        pageAfterExists={state.pageAfterExists}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default PlaybackHistoryPage;
