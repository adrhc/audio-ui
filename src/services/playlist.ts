import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/playlist';
import { SelectableSong, Song, isYtMusicPl, refsToSongs } from '../domain/song';
import { getPlContent as getMpcPlContent, isM3uMpcRefUri } from './mpc';
import { getPlContent as getAWSPlContent } from './audio-ws/audio-ws';
import { sortMediaLocations } from '../domain/media-location';
import { toSelected } from '../domain/Selectable';

/**
 * Same as getPlContent(imgMaxArea, playlistUri) but using SelectableSong instead of Song.
 */
export function getSelectablePlContent(imgMaxEdge: number, playlistUri: string): Promise<SelectableSong[]> {
  return getPlContent(imgMaxEdge, playlistUri).then((playlist) => playlist.map((s) => toSelected(s)));
}

/**
 * Get the playlist content from audio-db if it's an YouTube Music playlist.
 * Use Mopidy WebSocket for any other type of playlist.
 */
export function getPlContent(imgMaxArea: number, playlistUri: string): Promise<Song[]> {
  if (isYtMusicPl(playlistUri)) {
    return getYTPlContent(imgMaxArea, playlistUri).then(sortMediaLocations);
  } else {
    return getAWSSortedPlContent(imgMaxArea, playlistUri);
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
