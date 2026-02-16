import { get, post, postVoid, removeVoid } from '../../../lib/rest';
import { Song } from '../../../domain/song';
import { LocationSelection } from '../../../domain/location/types';
import { UriPlAllocationResult } from '../../../domain/UriPlAllocationResult';
import { toSongsWithImgUri } from '../converters';
import * as db from '../types';
import * as dbpl from './types';

export function getYTPlContent(imgMaxEdge: number, ytUri: string): Promise<Song[]> {
  // console.log('ytUri:', ytUri);
  // console.log('encodeURIComponent(ytUri):', encodeURIComponent(ytUri));
  return get<db.SongsPage>(`${db.YOUTUBE_PLAYLIST}/${encodeURIComponent(ytUri)}`).then((pg) =>
    toSongsWithImgUri(imgMaxEdge, pg.entries)
  );
}

/**
 * @param songUri song to add to many playlists
 * @param songTitle song's title
 * @param playlists the playlists to add the song to
 * @returns allocation outcome
 */
export function updateManyLocalPlaylists(
  songUri: string,
  songTitle: string | null | undefined,
  playlists: LocationSelection[]
): Promise<UriPlAllocationResult> {
  return post<dbpl.UriPlAllocationResult>(
    `${db.DISK_PLAYLIST}/add-song-to-playlists`,
    JSON.stringify(dbpl.toAudioDbLocationSelections(songUri, songTitle, playlists))
  ).then(dbpl.toUriPlAllocationResult);
}

export function removeFromLocalPl(plUri: string, songUri: string): Promise<void> {
  return removeVoid(db.DISK_PLAYLIST, JSON.stringify({plUri, songUri}));
}

/**
 * diskPlUri example: m3u/colinde.m3u8
 */
export function updateLocalPlaylist(diskPlUri: string, selections: LocationSelection[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, selections:`, selections);
  return postVoid(db.DISK_PLAYLIST, JSON.stringify(dbpl.toPlContentUpdateRequest(diskPlUri, selections)));
}
