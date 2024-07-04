import { models } from 'mopidy';
import { Song, refToSong } from '../../domain/song';
import { sortByAbsDiff } from '../../lib/image';

export interface RefWithImages extends models.Ref<models.ModelType> {
  thumbnails?: models.Image[];
}

export function refWithImagesToSongs(imgMaxArea: number, rwis: RefWithImages[]): Song[] {
  return rwis.map((rwi) => refWithImagesToSong(imgMaxArea, rwi));
}

export function refWithImagesToSong(imgMaxArea: number, rwi: RefWithImages): Song {
  const sortedThumbnails = sortByAbsDiff(imgMaxArea, rwi.thumbnails);
  const song = refToSong(rwi);
  return { ...song, imgUri: sortedThumbnails?.[0]?.uri };
}
