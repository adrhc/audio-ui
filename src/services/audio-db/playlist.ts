import { get, post, postVoid } from '../rest';
import { Song } from '../../domain/song';
import { LocationSelection, UriPlAllocationResult } from '../../domain/media-location';
import * as audiodb from './types';

export function getYTPlContent(imgMaxEdge: number, ytUri: string): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${audiodb.YOUTUBE_PLAYLIST}/${encodeURIComponent(ytUri)}`).then((pg) =>
    audiodb.toSongsWithImgUri(imgMaxEdge, pg.entries)
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
  return post<audiodb.UriPlAllocationResult>(
    `${audiodb.DISK_PLAYLIST}/add-song-to-playlists`,
    JSON.stringify(audiodb.toAudioDbLocationSelections(songUri, songTitle, playlists))
  ).then(audiodb.toUriPlAllocationResult);
}

/**
 * plUri e.g.: m3u/colinde.m3u8
 */
export function updateLocalPlaylist(diskPlUri: string, selections: LocationSelection[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, selections:`, selections);
  return postVoid(audiodb.DISK_PLAYLIST, JSON.stringify(audiodb.toPlContentUpdateRequest(diskPlUri, selections)));
}
