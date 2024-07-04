import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/audio-db';
import { Song, isYtMusicPl, refsToSongs, sortSongs } from '../domain/song';
import { getPlItems as getMpcPlItems, getPlaylists } from './mpc';
import { getPlContent } from './audio-ws/audio-ws';

/**
 * Get the playlist content from audio-db if it's an YouTube Music playlist.
 * Use Mopidy WebSocket for any other type of playlist.
 */
export function getPlaylistItems(imgMaxArea: number, uri: string): Promise<Song[]> {
  if (isYtMusicPl(uri)) {
    return getYTPlContent(imgMaxArea, uri).then(sortSongs);
  } else {
    return getPlItems(imgMaxArea, uri);
  }
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function getMopidyPlItems(mopidy: Mopidy | undefined, uri: string): Promise<Song[]> {
  const songsPromise = getMpcPlItems(mopidy, uri).then(refsToSongs);
  if (uri.startsWith('m3u:')) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortSongs);
  }
}

/**
 * Get the playlist content using/from audio-web-services.
 */
export function getPlItems(imgMaxArea: number, uri: string): Promise<Song[]> {
  const songsPromise = getPlContent(imgMaxArea, uri);
  if (uri.startsWith('m3u:')) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortSongs);
  }
}

/**
 * using Mopidy WebSocket
 */
export function getMopidyPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy).then(refsToSongs).then(sortSongs);
}
