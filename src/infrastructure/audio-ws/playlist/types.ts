import { models } from 'mopidy';
import { Song, refToSong } from '../../../domain/song';
import { sortByAbsDiff } from '../../../lib/image';

export interface RefWithImages extends models.Ref<models.ModelType> {
  thumbnails?: models.Image[];
}

export function refWithImagesToSongs(rwis: RefWithImages[], imgMaxArea?: number): Song[] {
  return rwis.map((rwi) => refWithImagesToSong(rwi, imgMaxArea));
}

function refWithImagesToSong(rwi: RefWithImages, imgMaxArea?: number): Song {
  const sortedThumbnails = imgMaxArea ? sortByAbsDiff(imgMaxArea, rwi.thumbnails) : null;
  const song = refToSong(rwi);
  return { ...song, imgUri: sortedThumbnails?.[0]?.uri };
}
