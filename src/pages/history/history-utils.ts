import { HistoryPage } from "../../domain/history";

export function toPartialState(prevSongsCount: number, page: HistoryPage) {
  return {
    before: page.first,
    after: page.last,
    pageBeforeExists: page.pageBeforeExists,
    pageAfterExists: page.pageAfterExists,
    completePageSize: page.completePageSize,
    songs: page.entries,
    prevSongsCount,
  };
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
