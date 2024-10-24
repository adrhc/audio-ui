import { get } from '../../services/rest';
import { SelectableSong, Song, toSelectableSong } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import { getNoImgPlContent } from '../audio-ws/playlist/playlist';
import { toSongsWithImgUri } from './converters';
import * as audiodb from './types';

const ROOT = '/audio-ui/db-api/songs-search';

/**
 * Search for songs by text but select only those from playlistUri.
 */
export async function searchSelectableSongs(
  imgMaxEdge: number,
  playlistUri: string,
  text: string
): Promise<SelectableSong[]> {
  const songs = await searchSongs(imgMaxEdge, text);
  const playlist = await getNoImgPlContent(playlistUri);
  return songs.map((s) => toSelectableSong(playlist, s));
}

export function searchSongs(imgMaxEdge: number, text: string): Promise<Song[]> {
  return get<audiodb.SongsPage>(`${ROOT}?${toParams(text)}`).then((songsPage) =>
    toSongsWithImgUri(imgMaxEdge, songsPage.entries)
  );
}

/* function searchDiskSongs(text: string): audiodb.AudioDbSong[] {
  return get<audiodb.AudioDbSongsPage>(`${ROOT}/disk?${toParams(text)}`).then(toAudioDbSongs);
}

function searchYouTubeVideos(text: string): audiodb.AudioDbSong[] {
  return get<audiodb.AudioDbSongsPage>(`${ROOT}/ytvideo?${toParams(text)}`).then(toAudioDbSongs);
}

function searchYouTubeMusic(text: string): audiodb.AudioDbSong[] {
  return get<audiodb.AudioDbSongsPage>(`${ROOT}/ytmusic?${toParams(text)}`).then(toAudioDbSongs);
} */

function toParams(text: string) {
  return toQueryParams(['text', text]);
}
