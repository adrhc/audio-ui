import { HistoryPage, HistoryPosition } from '../../domain/history';
import { ThinSongListState } from '../../domain/song';

export interface RawPlaybackHistoryPageState extends ThinSongListState {
  completePageSize: number;
  prevSongsCount: number;
  before?: HistoryPosition;
  after?: HistoryPosition;
  pageBeforeExists?: boolean;
  pageAfterExists?: boolean;
  downloadedUris: string[];
}

export function toRawPlaybackHistoryPageState(
  prevSongsCount: number,
  page: HistoryPage
): Partial<RawPlaybackHistoryPageState> {
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

/* export function toPartialHistoryCache(state: LoadingState<RawPlaybackHistoryPageState>) {
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
} */

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
