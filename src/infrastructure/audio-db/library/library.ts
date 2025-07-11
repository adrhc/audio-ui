import { get, post, remove } from '../../../lib/rest';
import { Song } from '../../../domain/song';
import { LocationSelection, MediaLocation } from '../../../domain/location/types';
import { toSongsWithImgUri } from '../converters';
import { toDiskPlaylistRemoveRequest, toPlSelections } from './types';
import * as audiodb from '../types';

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
  // console.log(`songUri: ${songUri}`)
  // console.log(`encodeURI(songUri): ${encodeURI(songUri)}`)
  // console.log(`encodeURIComponent(songUri): ${encodeURIComponent(songUri)}`)

  // 2x encoding approach must be used!
  // return get<audiodb.LocationSelections>(
    // `${audiodb.DISK_PLAYLIST}?${toQueryParams(['uri', encodeURI(songUri)])}`

  return post<audiodb.LocationSelections>(
    `${audiodb.DISK_PLAYLIST}/all-containing-song`, JSON.stringify({uri: songUri})
  ).then(toPlSelections);
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function removeLocalPlaylist(playlist: MediaLocation): Promise<boolean> {
  // console.log(`[removeDiskPlaylist] playlist:`, playlist);
  return remove<boolean>(audiodb.DISK_PLAYLIST, JSON.stringify(toDiskPlaylistRemoveRequest(playlist)));
}
