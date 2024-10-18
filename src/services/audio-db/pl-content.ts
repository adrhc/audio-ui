import { get, post, postVoid } from '../rest';
import { SelectableSong, Song } from '../../domain/song';
import { LocationSelection, UriPlAllocationResult } from '../../domain/media-location';
import { getPlContent } from '../audio-ws/audio-ws';
import { toSelected } from '../../domain/Selectable';
import * as audiodb from './types';

export function loadSelectablePlContent(imgMaxEdge: number, playlistUri: string): Promise<SelectableSong[]> {
  return getPlContent(imgMaxEdge, playlistUri).then((playlist) => playlist.map((s) => toSelected(s)));
}

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
export function updateUriPlaylists(
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
export function updateDiskPlContent(diskPlUri: string, selections: LocationSelection[]): Promise<void> {
  // console.log(`[updatePlContent] plUri = ${diskPlUri}, selections:`, selections);
  return postVoid(audiodb.DISK_PLAYLIST, JSON.stringify(audiodb.toPlContentUpdateRequest(diskPlUri, selections)));
}
