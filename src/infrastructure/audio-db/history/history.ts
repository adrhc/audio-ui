import { toSongUris } from '../../../domain/song';
import Mopidy, { models } from 'mopidy';
import { get, post, postVoid, removeVoid } from '../../../lib/rest';
import { HistoryPosition, HistoryPage } from '../../../domain/history';
import { getImages } from '../../mopidy/mpc/mpc';
import { addImgUriToSongs } from '../../mopidy/types';
import * as hst from './types';

const HISTORY = '/audio-ui/db-api/history';

export function addToHistory(tlTrack: models.TlTrack[]): Promise<void> {
  if (tlTrack.length == 0) {
    return Promise.reject("Can't add to the history!");
  } else {
    return postVoid(HISTORY, JSON.stringify(tlTrack.map((it) => it.track)));
  }
}

export function removeFromHistory(uri: string): Promise<void> {
  if (!uri) {
    return Promise.reject("Can't remove an empty history uri!");
  } else {
    return removeVoid(HISTORY, JSON.stringify({ uri }));
  }
}

export async function getHistoryBefore(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  before: HistoryPosition
): Promise<HistoryPage> {
  const audioDbHistoryPage = await post<hst.HistoryPage>(`${HISTORY}/before`, JSON.stringify(before));
  const hp = hst.toHistoryPage(audioDbHistoryPage);
  return mopidy == null ? hp : await addImgUriToHistoryPage(mopidy, imgMaxEdge, hp);
}

export async function getHistoryAfter(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  after: HistoryPosition
): Promise<HistoryPage> {
  const audioDbHistoryPage = await post<hst.HistoryPage>(`${HISTORY}/after`, JSON.stringify(after));
  const hp = hst.toHistoryPage(audioDbHistoryPage);
  return mopidy == null ? hp : await addImgUriToHistoryPage(mopidy, imgMaxEdge, hp);
}

export async function getHistory(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<HistoryPage> {
  const audioDbHistoryPage = await get<hst.HistoryPage>(HISTORY);
  const hp = hst.toHistoryPage(audioDbHistoryPage);
  return mopidy == null ? hp : await addImgUriToHistoryPage(mopidy, imgMaxEdge, hp);
}

async function addImgUriToHistoryPage(
  mopidy: Mopidy | undefined,
  imgMaxEdge: number,
  hp: HistoryPage
): Promise<HistoryPage> {
  const imagesMap = await getImages(mopidy, toSongUris(hp.entries));
  const entries = addImgUriToSongs(imgMaxEdge, imagesMap, hp.entries);
  return { ...hp, entries };
}
