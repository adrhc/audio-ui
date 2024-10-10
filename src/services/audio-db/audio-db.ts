import Mopidy, { models } from 'mopidy';
import { get, post, postVoid } from '../rest';
import { Song, toSongExtsWithImgUri, toSongUris } from '../../domain/song';
import { HistoryPosition, HistoryPage } from '../../domain/history';
import { LocationSelection, MediaLocation, UriPlAllocationResult } from '../../domain/media-location';
import { toQueryParams } from '../../lib/path-param-utils';
import { getImages } from '../mpc';
import * as audiodb from './types';

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

/**
 * @param songUri
 * @returns the playlists containing songUris
 */
export function getDiskPlaylists(songUri: string): Promise<LocationSelection[]> {
  // must use encodeURI!
  return get<audiodb.LocationSelections>(
    `${DISK_PLAYLIST}?${toQueryParams(['uri', encodeURI(songUri)])}`
  ).then(audiodb.toPlSelections);
}

/**
 * @param songUri song to add to many playlists
 * @param songTitle song's title
 * @param playlists the playlists to add the song to
 * @returns allocation outcome
 */
export function updateUriPlaylists(
  songUri: string,
  songTitle: string | null | undefined,
  playlists: LocationSelection[]
): Promise<UriPlAllocationResult> {
  return post<audiodb.UriPlAllocationResult>(
    `${DISK_PLAYLIST}/add-song-to-playlists`,
    JSON.stringify(audiodb.toAudioDbLocationSelections(songUri, songTitle, playlists))
  ).then(audiodb.toUriPlAllocationResult);
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function updateDiskPlContent(diskPlUri: string, songs: MediaLocation[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, songs:`, songs);
  return postVoid(DISK_PLAYLIST, JSON.stringify(audiodb.toPlContentUpdateRequest(diskPlUri, songs)));
}
