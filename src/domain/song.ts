import { models } from 'mopidy';
import { sortByAbsDiff } from '../lib/image';
import { isM3uMpcRefUri, m3uMpcRefUriToFileName, UriImagesMap } from '../services/mpc';
import { MediaLocation } from './media-location';

const compare = new Intl.Collator('en', { caseFirst: 'upper', sensitivity: 'base' }).compare;

export type SongsPage = {
  entries: Song[];
};

export interface Song extends MediaLocation {
  imgUri?: string | null;
}

export function formatUri(uri: string | null | undefined) {
  if (!uri) {
    return uri;
  } else if (uri.startsWith('file:///')) {
    const parts = decodeURIComponent(uri).split('/');
    if (parts.length > 1) {
      return parts.slice(parts.length - 2).join('/');
    } else {
      return uri;
    }
  } else if (isM3uMpcRefUri(uri)) {
    return m3uMpcRefUriToFileName(uri);
  } else {
    return uri;
  }
}

export function refsToSongs(refs: models.Ref<models.ModelType>[]): Song[] {
  return refs?.map(refToSong);
}

export function refToSong(ref: models.Ref<models.ModelType>): Song {
  return { type: ref.type, uri: ref.uri, formattedUri: formatUri(ref.uri)!, title: ref.name };
}

export function uriToSong(uri: string): Song {
  const formattedUri = formatUri(uri);
  return { type: 'URI', uri, formattedUri: formattedUri!, title: formattedUri! };
}

/* export function isYtLikedPl(song: Song) {
  return song.location.uri.endsWith(':VLLM') || song.location.uri.endsWith(':LM');
} */

export function isYtMusicPl(song: Song | string) {
  if (typeof song == 'string') {
    return song.startsWith('ytmusic:playlist:');
  } else {
    return song.uri.startsWith('ytmusic:playlist:');
    // song.uri.startsWith('youtube:playlist:') ||
    // song.uri.startsWith('yt:playlist:')
  }
}

export function isDiskPl(song: Song | string) {
  if (typeof song == 'string') {
    return song.endsWith('.m3u8');
  } else {
    return song.uri.endsWith('.m3u8');
  }
}

export function sortSongs(songs: Song[]) {
  return songs.sort((a, b) => compare(a.title, b.title));
}

/* export function sortRefs(refs: models.Ref<models.ModelType>[]) {
  return refs.sort((a, b) => compare(a.name, b.name));
} */

export function toSongUris(songs: Song[]): string[] {
  return songs.map((s) => s.uri).filter((it) => !!it) as string[];
}

export function toSongExtsWithImgUri<T extends Song>(
  imgMaxEdge: number,
  songs: T[],
  imagesMap: UriImagesMap
): T[] {
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  // console.log(`imagesMap:\n`, imagesMap);
  return songs.map((song) => toSongExtWithImgUri(imgMaxArea, imagesMap, song));
}

function toSongExtWithImgUri<T extends Song>(imgMaxArea: number, imagesMap: UriImagesMap, song: T): T {
  let images = song.uri ? imagesMap[song.uri] : undefined;
  images = sortByAbsDiff(imgMaxArea, images);
  // images.length && console.log(`images of ${track.uri}:\n`, images);
  return { ...song, imgUri: images?.[0]?.uri };
}
