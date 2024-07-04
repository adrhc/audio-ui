import { models } from 'mopidy';
import { get, post, postVoid } from '../rest';
import { Song } from '../../domain/song';
import { HistoryPosition, HistoryPage } from '../../domain/history';
import * as audiodb from './types';
import { LocationSelection, MediaLocation } from '../../domain/media-location';
import { toQueryParams } from '../../lib/path-param-utils';

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
  return postVoid(HISTORY, JSON.stringify(tlTrack.map((it) => it.track)));
}

export function getHistoryBefore(before: HistoryPosition): Promise<HistoryPage> {
  return post<audiodb.HistoryPage>(`${HISTORY}/before`, JSON.stringify(before)).then(audiodb.toHistoryPage);
}

export function getHistoryAfter(after: HistoryPosition): Promise<HistoryPage> {
  return post<audiodb.HistoryPage>(`${HISTORY}/after`, JSON.stringify(after)).then(audiodb.toHistoryPage);
}

export function getHistory(): Promise<HistoryPage> {
  return get<audiodb.HistoryPage>(HISTORY).then(audiodb.toHistoryPage);
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
    audiodb.toLocationSelections
  );
}

export function updateUriPlaylists(
  uri: string,
  title: string | null | undefined,
  locationSelections: LocationSelection[]
): Promise<MediaLocation[]> {
  return post<audiodb.MediaLocation[]>(
    DISK_PLAYLIST,
    JSON.stringify(audiodb.toAudioDbLocationSelections(uri, title, locationSelections))
  ).then(audiodb.toMediaLocations);
}
