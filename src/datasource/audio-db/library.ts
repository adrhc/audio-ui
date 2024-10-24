import { get, remove } from '../../services/rest';
import { Song } from '../../domain/song';
import { LocationSelection, MediaLocation } from '../../domain/media-location';
import { toQueryParams } from '../../lib/path-param-utils';
import { toPlSelections, toSongsWithImgUri } from './converters';
import { m3uMpcRefUriToDecodedFileName } from '../../services/mpc';
import * as audiodb from './types';

export function getYTLibrary(imgMaxEdge: number): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${audiodb.YOUTUBE_PLAYLIST}`).then((pg) =>
    toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

/**
 * @param songUri
 * @returns the playlists containing songUris
 */
export function getLocalLibrary(songUri: string): Promise<LocationSelection[]> {
  // must use encodeURI!
  return get<audiodb.LocationSelections>(
    `${audiodb.DISK_PLAYLIST}?${toQueryParams(['uri', encodeURI(songUri)])}`
  ).then(toPlSelections);
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function removeLocalPlaylist(playlist: MediaLocation): Promise<boolean> {
  // console.log(`[removeDiskPlaylist] playlist:`, playlist);
  return remove<boolean>(audiodb.DISK_PLAYLIST, JSON.stringify(toDiskPlaylistRemoveRequest(playlist)));
}

/**
 * Works with playlists loaded from MPC (i.e. models.Ref) but not audio-web-services.
 */
function toDiskPlaylistRemoveRequest(playlist: MediaLocation) {
  const { type, title, uri } = playlist;
  // console.log(`[toDbPlMediaLocation] uri:`, m3uMpcRefUriToFileName(uri));
  return { type, name: title, uri, fileName: m3uMpcRefUriToDecodedFileName(uri) };
}
