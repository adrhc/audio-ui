import { get } from '../rest';
import { sortByAbsDiff } from '../../lib/image';
import { Song } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import * as audiodb from './types';

const ROOT = '/audio-ui/db-api/songs-search';

export function searchSongs(imgMaxEdge: number, text: string): Promise<Song[]> {
  return searchAudioDbSongs(text).then((songs) => toSongsWithImgUri(imgMaxEdge, songs));
}

function toSongsWithImgUri(imgMaxEdge: number, audioDbSongs: audiodb.Song[]): Song[] {
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  return audioDbSongs.map((it) => toSongWithImgUri(imgMaxArea, it));
}

function toSongWithImgUri(imgMaxArea: number, audioDbSong: audiodb.Song): Song {
  const sortedThumbnails = sortByAbsDiff(imgMaxArea, audioDbSong.thumbnails);
  return { imgUri: sortedThumbnails?.[0]?.uri, ...audiodb.toSong(audioDbSong) };
}

function searchAudioDbSongs(text: string): Promise<audiodb.Song[]> {
  return get<audiodb.SongsPage>(`${ROOT}?${toParams(text)}`).then(toAudioDbSongs);
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

function toAudioDbSongs(page: audiodb.SongsPage): audiodb.Song[] {
  return page.entries;
}

function toParams(text: string) {
  return toQueryParams(['text', text]);
}
