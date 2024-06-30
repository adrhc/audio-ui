import { models } from 'mopidy';

const compare = new Intl.Collator('en', { caseFirst: 'upper', sensitivity: 'base' }).compare;

export type SongsPage = {
  entries: Song[];
};

export type Song = {
  type: string;
  uri: string;
  formattedUri: string;
  title: string;
  imgUri?: string | null;
};

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
  } else if (uri.startsWith('m3u:')) {
    return decodeURIComponent(uri.substring(4));
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

export function sortSongs(songs: Song[]) {
  return songs.sort((a, b) => compare(a.title, b.title));
}

/* export function sortRefs(refs: models.Ref<models.ModelType>[]) {
  return refs.sort((a, b) => compare(a.name, b.name));
} */
