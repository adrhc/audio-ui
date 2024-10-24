import Mopidy, { models } from 'mopidy';
import { get, post, postVoid } from '../../../services/rest';
import { HistoryPosition, HistoryPage } from '../../../domain/history';
import { toNoImgSongs } from '../converters';
import * as db from './types';

const HISTORY = '/audio-ui/db-api/history';

export function addToHistory(tlTrack: models.TlTrack[]) {
  if (tlTrack.length == 0) {
    return Promise.reject("Can't add an empty track list to the history!");
  } else {
    return postVoid(HISTORY, JSON.stringify(tlTrack.map((it) => it.track)));
  }
}

export function getHistoryBefore(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  before: HistoryPosition
): Promise<HistoryPage> {
  return post<db.HistoryPage>(`${HISTORY}/before`, JSON.stringify(before))
    .then(toHistoryPage)
    .then((hp) => db.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistoryAfter(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  after: HistoryPosition
): Promise<HistoryPage> {
  return post<db.HistoryPage>(`${HISTORY}/after`, JSON.stringify(after))
    .then(toHistoryPage)
    .then((hp) => db.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistory(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<HistoryPage> {
  return get<db.HistoryPage>(HISTORY)
    .then(toHistoryPage)
    .then((hp) => db.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

/**
 * DB/HistoryPage -> HistoryPage
 */
function toHistoryPage(audioDbHistoryPage: db.HistoryPage): HistoryPage {
  const { entries, ...dbHistoryPageRest } = audioDbHistoryPage;
  // return { ...dbHistoryPageRest, entries: toSongsWithImgUri(imgMaxArea, entries) };
  return { ...dbHistoryPageRest, entries: toNoImgSongs(entries) };
}
