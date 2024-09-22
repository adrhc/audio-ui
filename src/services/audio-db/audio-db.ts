import Mopidy, { models } from 'mopidy';
import { get, post, postVoid } from '../rest';
import { Song, toSongExtsWithImgUri, toSongUris } from '../../domain/song';
import { HistoryPosition, HistoryPage } from '../../domain/history';
import * as audiodb from './types';
import { LocationSelection, UriPlAllocationResult } from '../../domain/media-location';
import { toQueryParams } from '../../lib/path-param-utils';
import { getImages } from '../mpc';

const YOUTUBE_PLAYLIST = '/audio-ui/db-api/youtube/playlist';
const DISK_PLAYLIST = '/audio-ui/db-api/disk/playlist';
const HISTORY = '/audio-ui/db-api/history';
const INDEX_MANAGER = '/audio-ui/db-api/index-manager';

export function reset() {
  return postVoid(`${INDEX_MANAGER}/reset`);
}

export function shallowDiskUpdate() {
  return postVoid(`${INDEX_MANAGER}/shallowDiskUpdate`);
}

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

export function getYTPlaylists(imgMaxEdge: number): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${YOUTUBE_PLAYLIST}`).then((pg) =>
    audiodb.toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

export function getYTPlContent(imgMaxEdge: number, ytUri: string): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${YOUTUBE_PLAYLIST}/${encodeURIComponent(ytUri)}`).then((pg) =>
    audiodb.toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

export function getDiskPlaylists(uri: string): Promise<LocationSelection[]> {
  // must use encodeURI!
  return get<audiodb.LocationSelections>(`${DISK_PLAYLIST}?${toQueryParams(['uri', encodeURI(uri)])}`).then(
    audiodb.toPlSelections
  );
}

export function updateUriPlaylists(
  uri: string,
  title: string | null | undefined,
  locationSelections: LocationSelection[]
): Promise<UriPlAllocationResult> {
  return post<audiodb.UriPlAllocationResult>(
    DISK_PLAYLIST,
    JSON.stringify(audiodb.toAudioDbLocationSelections(uri, title, locationSelections))
  ).then(audiodb.toUriPlAllocationResult);
}
