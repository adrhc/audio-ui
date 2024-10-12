import { HistoryPage, HistoryPosition } from '../../domain/history';
import { ThinSongListState } from '../../hooks/list/useSongList';
import { LoadingState } from '../../lib/sustain';

export interface RawPlaybackHistoryPageState extends ThinSongListState {
  completePageSize: number;
  prevSongsCount: number;
  before?: HistoryPosition;
  after?: HistoryPosition;
  pageBeforeExists?: boolean;
  pageAfterExists?: boolean;
}

export interface HistoryCache extends RawPlaybackHistoryPageState {
  scrollTop: number;
}

export function toPartialState(prevSongsCount: number, page: HistoryPage) {
  return {
    songs: page.entries,
    before: page.first,
    after: page.last,
    pageBeforeExists: page.pageBeforeExists,
    pageAfterExists: page.pageAfterExists,
    completePageSize: page.completePageSize,
    prevSongsCount,
  };
}

export function toPartialHistoryCache(state: LoadingState<RawPlaybackHistoryPageState>) {
  return state.pageBeforeExists
    ? {
        songs: state.songs,
        lastUsed: state.lastUsed,
        before: state.before,
        after: state.after,
        pageBeforeExists: state.pageBeforeExists,
        pageAfterExists: state.pageAfterExists,
        completePageSize: state.completePageSize,
        prevSongsCount: state.prevSongsCount,
      }
    : { lastUsed: state.lastUsed };
}

/* export function addNavRows(page: HistoryPage) {
  if (page.pageAfterExists) {
    if (page.pageBeforeExists) {
      return [PREVIOUS_PAGE, ...page.entries, NEXT_PAGE];
    } else {
      return [...page.entries, NEXT_PAGE];
    }
  } else {
    return page.pageBeforeExists ? [PREVIOUS_PAGE] : [];
  }
} */
