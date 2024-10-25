import Mopidy, { models } from 'mopidy';
import { get, post, postVoid } from '../../../lib/rest';
import { HistoryPosition, HistoryPage } from '../../../domain/history';
import * as hst from './types';

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
  return post<hst.HistoryPage>(`${HISTORY}/before`, JSON.stringify(before))
    .then(hst.toHistoryPage)
    .then((hp) => hst.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistoryAfter(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  after: HistoryPosition
): Promise<HistoryPage> {
  return post<hst.HistoryPage>(`${HISTORY}/after`, JSON.stringify(after))
    .then(hst.toHistoryPage)
    .then((hp) => hst.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistory(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<HistoryPage> {
  return get<hst.HistoryPage>(HISTORY)
    .then(hst.toHistoryPage)
    .then((hp) => hst.toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}
