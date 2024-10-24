import Mopidy from 'mopidy';
import { getPlaylists } from '../services/mpc';
import { Song, isLocalPl, refsToSongs } from '../domain/song';
import { sortMediaLocations } from '../domain/media-location';

/**
 * using Mopidy WebSocket
 */
export function getLocalLibrary(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getLibrary(mopidy, (songs) => songs.filter(isLocalPl));
}

/**
 * using Mopidy WebSocket
 */
export function getLibrary(mopidy: Mopidy | undefined, filter?: (songs: Song[]) => Song[]): Promise<Song[]> {
  return getPlaylists(mopidy)
    .then(refsToSongs)
    .then((songs) => (filter ? songs.filter(isLocalPl) : songs))
    .then(sortMediaLocations);
}
