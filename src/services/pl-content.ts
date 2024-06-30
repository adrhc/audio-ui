import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/audio-db';
import { Song, isYtMusicPl, refsToSongs, sortSongs } from '../domain/song';
import { getPlItems, getPlaylists } from './mpc';

/**
 * Get the playlist content from audio-db if it's an YouTube Music playlist.
 * Use Mopidy WebSocket for any other type of playlist.
 */
export function getPlaylistItems(mopidy: Mopidy | undefined, uri: string): Promise<Song[]> {
  if (isYtMusicPl(uri)) {
    return getYTPlContent(uri).then(sortSongs);
  } else {
    return getMopidyPlItems(mopidy, uri);
  }
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function getMopidyPlItems(mopidy: Mopidy | undefined, uri: string): Promise<Song[]> {
  const songsPromise = getPlItems(mopidy, uri).then(refsToSongs);
  if (uri.startsWith('m3u:')) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortSongs);
  }
}

/**
 * using WebSocket
 */
export function getMopidyPlaylists(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy).then(refsToSongs).then(sortSongs);
}
