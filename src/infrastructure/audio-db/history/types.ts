import { HistoryPosition } from '../../../domain/history';
import { SongsPage } from '../types';
import { toNoImgSongs } from '../converters';
import * as hst from '../../../domain/history';

export interface HistoryPage extends SongsPage {
  first: HistoryPosition;
  last: HistoryPosition;
  pageBeforeExists: boolean;
  pageAfterExists: boolean;
  completePageSize: number;
}

/**
 * DB/HistoryPage -> HistoryPage
 */
export function toHistoryPage(audioDbHistoryPage: HistoryPage): hst.HistoryPage {
  const { entries, ...dbHistoryPageRest } = audioDbHistoryPage;
  // return { ...dbHistoryPageRest, entries: toSongsWithImgUri(imgMaxArea, entries) };
  return { ...dbHistoryPageRest, entries: toNoImgSongs(entries) };
}
