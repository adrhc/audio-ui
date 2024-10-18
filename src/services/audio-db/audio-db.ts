import { get, post, postVoid, remove } from '../rest';
import { SelectableSong, Song } from '../../domain/song';
import { LocationSelection, MediaLocation, UriPlAllocationResult } from '../../domain/media-location';
import { toQueryParams } from '../../lib/path-param-utils';
import { getPlContent } from '../audio-ws/audio-ws';
import { toSelected } from '../../domain/Selectable';
import * as audiodb from './types';

const YOUTUBE_PLAYLIST = '/audio-ui/db-api/youtube/playlist';
const DISK_PLAYLIST = '/audio-ui/db-api/disk/playlist';

export function loadSelectablePlaylist(imgMaxEdge: number, playlistUri: string): Promise<SelectableSong[]> {
  return getPlContent(imgMaxEdge, playlistUri).then((playlist) => playlist.map((s) => toSelected(s)));
}

export function getYTPlaylists(imgMaxEdge: number): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${YOUTUBE_PLAYLIST}`).then((pg) =>
    audiodb.toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

export function getYTPlContent(imgMaxEdge: number, ytUri: string): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${YOUTUBE_PLAYLIST}/${encodeURIComponent(ytUri)}`).then((pg) =>
    audiodb.toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

/**
 * @param songUri
 * @returns the playlists containing songUris
 */
export function getDiskPlaylists(songUri: string): Promise<LocationSelection[]> {
  // must use encodeURI!
  return get<audiodb.LocationSelections>(
    `${DISK_PLAYLIST}?${toQueryParams(['uri', encodeURI(songUri)])}`
  ).then(audiodb.toPlSelections);
}

/**
 * @param songUri song to add to many playlists
 * @param songTitle song's title
 * @param playlists the playlists to add the song to
 * @returns allocation outcome
 */
export function updateUriPlaylists(
  songUri: string,
  songTitle: string | null | undefined,
  playlists: LocationSelection[]
): Promise<UriPlAllocationResult> {
  return post<audiodb.UriPlAllocationResult>(
    `${DISK_PLAYLIST}/add-song-to-playlists`,
    JSON.stringify(audiodb.toAudioDbLocationSelections(songUri, songTitle, playlists))
  ).then(audiodb.toUriPlAllocationResult);
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function updateDiskPlContent(diskPlUri: string, selections: LocationSelection[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, selections:`, selections);
  return postVoid(DISK_PLAYLIST, JSON.stringify(audiodb.toPlContentUpdateRequest(diskPlUri, selections)));
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function removeDiskPlaylist(playlist: MediaLocation): Promise<boolean> {
  // console.log(`[removeDiskPlaylist] playlist:`, playlist);
  return remove<boolean>(DISK_PLAYLIST, JSON.stringify(audiodb.toDiskPlaylistRemoveRequest(playlist)));
}
