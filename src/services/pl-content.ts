import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/audio-db';
import { Song, isLocalPl, isYtMusicPl, refsToSongs, sortSongs } from '../domain/song';
import { getPlItems as getMpcPlItems, getPlaylists, isM3uMpcRefUri } from './mpc';
import { getPlContent } from './audio-ws/audio-ws';

/**
 * using Mopidy WebSocket
 */
export function getLocalPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy)
    .then(refsToSongs)
    .then((songs) => songs.filter(isLocalPl))
    .then(sortSongs);
}

/**
 * using Mopidy WebSocket
 */
export function getAllPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy).then(refsToSongs).then(sortSongs);
}

/**
 * Get the playlist content from audio-db if it's an YouTube Music playlist.
 * Use Mopidy WebSocket for any other type of playlist.
 */
export function getPlaylistItems(imgMaxArea: number, uri: string): Promise<Song[]> {
  if (isYtMusicPl(uri)) {
    return getYTPlContent(imgMaxArea, uri).then(sortSongs);
  } else {
    return getAWSPlItems(imgMaxArea, uri);
  }
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function getMopidyPlItems(mopidy: Mopidy | undefined, uri: string): Promise<Song[]> {
  const songsPromise = getMpcPlItems(mopidy, uri).then(refsToSongs);
  return sortSongsIfNotFromLocalPl(uri, songsPromise);
}

/**
 * Get the playlist content using/from audio-web-services.
 */
export function getAWSPlItems(imgMaxArea: number, uri: string): Promise<Song[]> {
  const songsPromise = getPlContent(imgMaxArea, uri);
  return sortSongsIfNotFromLocalPl(uri, songsPromise);
}

function sortSongsIfNotFromLocalPl(uri: string, songsPromise: Promise<Song[]>) {
  if (isM3uMpcRefUri(uri)) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortSongs);
  }
}
