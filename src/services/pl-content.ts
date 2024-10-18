import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/pl-content';
import { Song, isLocalPl, isYtMusicPl, refsToSongs } from '../domain/song';
import { getPlContent as getMpcPlContent, getPlaylists, isM3uMpcRefUri } from './mpc';
import { getPlContent as getAWSPlContent } from './audio-ws/audio-ws';
import { sortMediaLocations } from '../domain/media-location';

/**
 * using Mopidy WebSocket
 */
export function getLocalPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy)
    .then(refsToSongs)
    .then((songs) => songs.filter(isLocalPl))
    .then(sortMediaLocations);
}

/**
 * using Mopidy WebSocket
 */
export function getAllPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy).then(refsToSongs).then(sortMediaLocations);
}

/**
 * Get the playlist content from audio-db if it's an YouTube Music playlist.
 * Use Mopidy WebSocket for any other type of playlist.
 */
export function getPlContent(imgMaxArea: number, uri: string): Promise<Song[]> {
  if (isYtMusicPl(uri)) {
    return getYTPlContent(imgMaxArea, uri).then(sortMediaLocations);
  } else {
    return getAWSSortedPlContent(imgMaxArea, uri);
  }
}

/**
 * Get the playlist content using/from audio-web-services (which uses Mopidy).
 */
export function getAWSSortedPlContent(imgMaxArea: number, uri: string): Promise<Song[]> {
  const songsPromise = getAWSPlContent(imgMaxArea, uri);
  return sortSongsIfNotFromLocalPl(uri, songsPromise);
}

/**
 * Get the playlist content from Mopidy WebSocket (no images!).
 */
export function getMpcSortedPlContent(mopidy: Mopidy | undefined, uri: string): Promise<Song[]> {
  const songsPromise = getMpcPlContent(mopidy, uri).then(refsToSongs);
  return sortSongsIfNotFromLocalPl(uri, songsPromise);
}

function sortSongsIfNotFromLocalPl(uri: string, songsPromise: Promise<Song[]>): Promise<Song[]> {
  if (isM3uMpcRefUri(uri)) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortMediaLocations);
  }
}
