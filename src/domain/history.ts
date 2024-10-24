import { SongsPage } from './song';

export interface HistoryPage extends SongsPage {
  first: HistoryPosition;
  last: HistoryPosition;
  pageBeforeExists: boolean;
  pageAfterExists: boolean;
  completePageSize: number;
}

export interface HistoryPosition {
  doc: number;
  shardIndex?: number | null;
  fields?: number[] | null;
}
