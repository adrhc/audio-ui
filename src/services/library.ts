import Mopidy from 'mopidy';
import { getPlaylists } from './mpc';
import { Song, isLocalPl, refsToSongs } from '../domain/song';
import { sortMediaLocations } from '../domain/media-location';

/**
 * using Mopidy WebSocket
 */
export function getLocalLibrary(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy)
    .then(refsToSongs)
    .then((songs) => songs.filter(isLocalPl))
    .then(sortMediaLocations);
}

/**
 * using Mopidy WebSocket
 */
export function getLibrary(mopidy: Mopidy | undefined): Promise<Song[]> {
  return getPlaylists(mopidy).then(refsToSongs).then(sortMediaLocations);
}
