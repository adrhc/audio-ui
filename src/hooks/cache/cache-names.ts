import { LocationSelection } from '../../domain/media-location';

export const LOCAL_LIBRARY_PLAY_CACHE = 'local-library/play';
export const LOCAL_LIBRARY_EDIT_CACHE = 'local-library/edit';
export const PLAYLIST_HISTORY = 'history';
export const SONG_SEARCH = 'search';
export const YOUTUBE_LIBRARY = 'youtube-library';

/**
 * @param plUri e.g. m3u/colinde
 */
export function plCacheName(plUri?: string) {
  console.log(`[ytPlCacheName] playlist/${plUri}`);
  if (plUri) {
    return `playlist/${plUri}`;
  } else {
    throw new Error('Empty uri is not allowed!');
  }
}

export function toPlCacheName(plSelection: LocationSelection) {
  if (plSelection.type == 'DISK') {
    // e.g. m3u/colinde.m3u8
    console.log(`[toLocalPlCacheName] plSelection.uri = ${plSelection.uri}`);
    const parts = decodeURIComponent(plSelection.uri).split('/');
    // has nothing to do with models.Ref.uri format (e.g. m3u:Marcin%20Patrzalek.m3u8)
    return plCacheName(`m3u:${parts[parts.length - 1]}`);
  } else {
    return plCacheName(plSelection.uri);
  }
}
