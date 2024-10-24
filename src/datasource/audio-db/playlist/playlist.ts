import { get, post, postVoid } from '../../../services/rest';
import { Song } from '../../../domain/song';
import { LocationSelection, UriPlAllocationResult } from '../../../domain/media-location';
import { toSongsWithImgUri } from '../converters';
import * as db from '../types';
import * as dbpl from './types';

export function getYTPlContent(imgMaxEdge: number, ytUri: string): Promise<Song[]> {
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

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function updateLocalPlaylist(diskPlUri: string, selections: LocationSelection[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, selections:`, selections);
  return postVoid(db.DISK_PLAYLIST, JSON.stringify(dbpl.toPlContentUpdateRequest(diskPlUri, selections)));
}
