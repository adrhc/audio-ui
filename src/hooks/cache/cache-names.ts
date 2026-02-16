import { LocationSelection } from '../../domain/location/types';

export const LOCAL_LIBRARY_PLAY_CACHE = 'local-library/play';
export const LOCAL_LIBRARY_EDIT_CACHE = 'local-library/edit';
export const PLAYLIST_HISTORY = 'history';
export const SONG_SEARCH = 'search';
export const YOUTUBE_LIBRARY = 'youtube-library';
export const CURRENT_PLAY_TO_PL_ALLOCATOR_PAGE = 'CURRENT_PLAY_TO_PL_ALLOCATOR_PAGE';

/**
 * @param plUri e.g. m3u/colinde
 */
export function plEditSearchCacheName(playlistUri?: string) {
  // console.log(`[plEditSearchCacheName] edit-search/${playlistUri}`);
  if (playlistUri) {
    return `edit-search/${playlistUri}`;
  } else {
    throw new Error('Empty uri is not allowed!');
  }
}

export function plCacheNameOfSelection(plSelection: LocationSelection) {
  if (plSelection.type == 'DISK') {
    // e.g. m3u/colinde.m3u8
    // console.log(`[toLocalPlCacheName] plSelection.uri = ${plSelection.uri}`);
    const parts = decodeURIComponent(plSelection.uri).split('/');
    // has nothing to do with models.Ref.uri format (e.g. m3u:Marcin%20Patrzalek.m3u8)
    return plCacheName(`m3u:${parts[parts.length - 1]}`);
  } else {
    return plCacheName(plSelection.uri);
  }
}

/**
 * @param playlistUri e.g. m3u/colinde
 */
export function plCacheName(playlistUri?: string) {
  // console.log(`[plCacheName] playlist/${playlistUri}`);
  if (playlistUri) {
    return `playlist/${playlistUri}`;
  } else {
    throw new Error('Empty uri is not allowed!');
  }
}
