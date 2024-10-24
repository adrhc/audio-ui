import { models } from 'mopidy';
import { Song } from '../../domain/song';
import { sortByAbsDiff } from '../../lib/image';

export type UriImagesMap = { [index: string]: models.Image[] };

export function addImgUriToMany<T extends Song>(
  imgMaxEdge: number,
  songs: T[],
  imagesMap: UriImagesMap
): T[] {
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  // console.log(`imagesMap:\n`, imagesMap);
  return songs.map((song) => addImgUri(imgMaxArea, imagesMap, song));
}

function addImgUri<T extends Song>(imgMaxArea: number, imagesMap: UriImagesMap, song: T): T {
  let images = song.uri ? imagesMap[song.uri] : undefined;
  images = sortByAbsDiff(imgMaxArea, images);
  // images.length && console.log(`images of ${track.uri}:\n`, images);
  return { ...song, imgUri: images?.[0]?.uri };
}
