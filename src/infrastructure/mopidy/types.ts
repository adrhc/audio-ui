import { models } from 'mopidy';
import { Song } from '../../domain/song';
import { sortByAbsDiff } from '../../lib/image';

export interface UriImagesMap {
  [index: string]: models.Image[];
}

export interface PlayOptions {
  consume?: boolean;
  random?: boolean;
  repeat?: boolean;
  single?: boolean;
}

export function addImgUriToSongs<T extends Song>(
  imgMaxEdge: number,
  imagesMap: UriImagesMap,
  songs: T[],
): T[] {
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  // console.log(`imagesMap:\n`, imagesMap);
  return songs.map((song) => addImgUriToSong(imgMaxArea, imagesMap, song));
}

function addImgUriToSong<T extends Song>(imgMaxArea: number, imagesMap: UriImagesMap, song: T): T {
  let images = song.uri ? imagesMap[song.uri] : undefined;
  images = sortByAbsDiff(imgMaxArea, images);
  // images.length && console.log(`images of ${song.uri}:\n`, images);
  return { ...song, imgUri: images?.[0]?.uri };
}
