import Mopidy, { models } from 'mopidy';
import { get, post, postVoid } from '../rest';
import { toSongExtsWithImgUri, toSongUris } from '../../domain/song';
import { HistoryPosition, HistoryPage } from '../../domain/history';
import { getImages } from '../mpc';
import * as audiodb from './types';

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
  return post<audiodb.HistoryPage>(`${HISTORY}/before`, JSON.stringify(before))
    .then(audiodb.toHistoryPage)
    .then((hp) => toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistoryAfter(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  after: HistoryPosition
): Promise<HistoryPage> {
  return post<audiodb.HistoryPage>(`${HISTORY}/after`, JSON.stringify(after))
    .then(audiodb.toHistoryPage)
    .then((hp) => toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

export function getHistory(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<HistoryPage> {
  return get<audiodb.HistoryPage>(HISTORY)
    .then(audiodb.toHistoryPage)
    .then((hp) => toHistoryPageWithImages(mopidy, imgMaxEdge, hp));
}

function toHistoryPageWithImages(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  hp: HistoryPage
): Promise<HistoryPage> {
  return getImages(mopidy, toSongUris(hp.entries))?.then((imagesMap) => {
    const entries = toSongExtsWithImgUri(imgMaxEdge, hp.entries, imagesMap);
    return { ...hp, entries };
  });
}
