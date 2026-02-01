import { models } from 'mopidy';
import { MediaLocation } from './location/types';
import { uriEqual } from './location/utils';
import Selectable from './Selectable';
import { isM3uMpcRefUri, m3uMpcRefUriToDecodedFileName } from '../infrastructure/mopidy/utils';

export interface SongsPage {
  entries: Song[];
}

export function toSelectableSong(songs: Song[], song: Song): SelectableSong {
  return { ...song, selected: !!songs.find((s) => uriEqual(s.uri, song.uri)) };
}

export interface SelectableSong extends Song, Selectable {}

export interface Song extends MediaLocation {
  imgUri?: string | null;
}

export interface LastUsedMediaAware {
  lastUsed?: Song | null;
}

export interface SongsAware {
  songs: SelectableSong[];
}

/**
 * The purpose of this structure is to provide the basic state
 * (and cache) structure for the features extending useSongList.
 */
export interface ThinSongListState extends SongsAware, LastUsedMediaAware {}

export function formatFilePath(filePath: string) {
  const parts = decodeURIComponent(filePath).split('/');
  if (parts.length > 1) {
    return parts.slice(parts.length - 2).join('/');
  } else {
    return filePath;
  }
}

export function formatUri(uri: string | null | undefined) {
  if (!uri) {
    return uri;
  } else if (uri.startsWith('file:///')) {
    return formatFilePath(uri);
  } else if (isM3uMpcRefUri(uri)) {
    return m3uMpcRefUriToDecodedFileName(uri);
  } else {
    return uri;
  }
}

export function refsToSongs(refs: models.Ref<models.ModelType>[]): Song[] {
  return refs?.map(refToSong);
}

export function refToSong(ref: models.Ref<models.ModelType>): Song {
  // console.log(`[refToSong] ref.uri`, ref.uri);
  return { type: ref.type, uri: ref.uri, formattedUri: formatUri(ref.uri)!, title: ref.name };
}

export function uriToSong(uri: string): Song {
  const formattedUri = formatUri(uri);
  return { type: 'URI', uri, formattedUri: formattedUri!, title: formattedUri! };
}

/* export function isYtLikedPl(song: Song) {
  return song.location.uri.endsWith(':VLLM') || song.location.uri.endsWith(':LM');
} */

export function isPlaylist(song: Song) {
  return song.type == 'playlist';
}

export function isYtMusicPl(song: Song | string) {
  if (typeof song == 'string') {
    return song.startsWith('ytmusic:playlist:');
  } else {
    return song.type == 'playlist' && song.uri.startsWith('ytmusic:playlist:');
    // song.uri.startsWith('youtube:playlist:') ||
    // song.uri.startsWith('yt:playlist:')
  }
}

export function isYtVideo(song: Song | string) {
  if (typeof song == 'string') {
    return song.startsWith('youtube:video:');
  } else {
    return song.uri.startsWith('youtube:video:');
  }
}

export function isLocalPl(song: Song | string) {
  if (typeof song == 'string') {
    // return song.endsWith('.m3u8');
    return song.startsWith('m3u:');
  } else {
    // return song.uri.endsWith('.m3u8');
    return song.type == 'playlist' && song.uri.startsWith('m3u:');
  }
}

/* export function sortRefs(refs: models.Ref<models.ModelType>[]) {
  return refs.sort((a, b) => compare(a.name, b.name));
} */

export function toSongUris(songs: Song[]): string[] {
  return songs.map((s) => s.uri).filter((it) => !!it) as string[];
}
