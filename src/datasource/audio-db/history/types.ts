import Mopidy from 'mopidy';
import { toSongExtsWithImgUri, toSongUris } from '../../../domain/song';
import { HistoryPosition } from '../../../domain/history';
import { getImages } from '../../../services/mpc';
import { SongsPage } from '../types';
import { toNoImgSongs } from '../converters';
import * as app from '../../../domain/history';

export interface HistoryPage extends SongsPage {
  first: HistoryPosition;
  last: HistoryPosition;
  pageBeforeExists: boolean;
  pageAfterExists: boolean;
  completePageSize: number;
}

export function toHistoryPageWithImages(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  hp: app.HistoryPage
): Promise<app.HistoryPage> {
  return getImages(mopidy, toSongUris(hp.entries))?.then((imagesMap) => {
    const entries = toSongExtsWithImgUri(imgMaxEdge, hp.entries, imagesMap);
    return { ...hp, entries };
  });
}

/**
 * DB/HistoryPage -> HistoryPage
 */
export function toHistoryPage(audioDbHistoryPage: HistoryPage): app.HistoryPage {
  const { entries, ...dbHistoryPageRest } = audioDbHistoryPage;
  // return { ...dbHistoryPageRest, entries: toSongsWithImgUri(imgMaxArea, entries) };
  return { ...dbHistoryPageRest, entries: toNoImgSongs(entries) };
}
