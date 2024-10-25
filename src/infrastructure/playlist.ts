import Mopidy from 'mopidy';
import { getYTPlContent } from './audio-db/playlist/playlist';
import { SelectableSong, Song, isYtMusicPl, refsToSongs } from '../domain/song';
import { getPlContent as getMpcPlContent } from './mopidy/mpc/mpc';
import { getSortedPlContent } from './audio-ws/playlist/playlist';
import { sortMediaLocations, sortMediaLocationsIfNotFromLocalPl } from '../domain/location/utils';
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
    return getSortedPlContent(imgMaxArea, playlistUri);
  }
}

/**
 * Get the playlist content from Mopidy WebSocket (no images!).
 * Alternative to getSortedNoImgPlContent.
 */
export function getMpcSortedNoImgPlContent(mopidy: Mopidy | undefined, playlistUri: string): Promise<Song[]> {
  const songsPromise = getMpcPlContent(mopidy, playlistUri).then(refsToSongs);
  return sortMediaLocationsIfNotFromLocalPl(playlistUri, songsPromise);
}
