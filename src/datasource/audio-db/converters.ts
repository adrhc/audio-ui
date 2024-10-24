import { MediaLocation, uriToTitle } from '../../domain/media-location';
import { formatUri, Song } from '../../domain/song';
import { sortByAbsDiff } from '../../lib/image';
import * as db from './types';

/**
 * DB/MediaLocation -> MediaLocation
 */
export function toPlMediaLocation(audioDbLoc: db.MediaLocation): MediaLocation {
  const { type, name, uri } = audioDbLoc;
  return {
    type,
    title: name ?? uriToTitle(uri)!,
    uri,
    formattedUri: formatUri(uri)!,
  };
}

/**
 * DB/SongsPage -> SongsPage
export function toNoImgSongsPage(audioDbSongsPage: db.SongsPage): SongsPage {
  return { entries: toNoImgSongs(audioDbSongsPage.entries) };
}
 */

/**
 * DB/Song[] + imgMaxEdge -> Song[]
 */
export function toSongsWithImgUri(imgMaxEdge: number, audioDbSongs: db.Song[]): Song[] {
  if (imgMaxEdge <= 0) {
    return toNoImgSongs(audioDbSongs);
  }
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  return audioDbSongs.map((it) => toSongWithImgUri(imgMaxArea, it));
}

/**
 * DB/Song + imgMaxEdge -> Song
 */
function toSongWithImgUri(imgMaxArea: number, audioDbSong: db.Song): Song {
  const sortedThumbnails = sortByAbsDiff(imgMaxArea, audioDbSong.thumbnails);
  return { imgUri: sortedThumbnails?.[0]?.uri, ...toNoImgSong(audioDbSong) };
}

/**
 * DB/SongsPage -> Song[]
export function pageToNoImgSongs(page: db.SongsPage): Song[] {
  return toNoImgSongs(page.entries);
}
 */

/**
 * DB/Song[] -> Song[]
 */
export function toNoImgSongs(audioDbSongs: db.Song[]): Song[] {
  return audioDbSongs.map(toNoImgSong);
}

/**
 * DB/Song -> Song
 */
export function toNoImgSong(audioDbSong: db.Song): Song {
  const { title, location } = audioDbSong;
  const { type, uri } = location;
  return { type, uri, formattedUri: formatUri(uri)!, title };
}
