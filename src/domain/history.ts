import { SongsPage } from './song';

export type HistoryPage = {
  first: HistoryPosition;
  last: HistoryPosition;
  pageBeforeExists: boolean;
  pageAfterExists: boolean;
  completePageSize: number;
} & SongsPage;

export type HistoryPosition = {
  doc: number;
  shardIndex?: number | null;
  fields?: number[] | null;
};
