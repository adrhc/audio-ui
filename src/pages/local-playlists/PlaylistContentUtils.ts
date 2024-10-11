import { LocationSelection } from '../../domain/media-location';

/**
 * @param plUri e.g. m3u/colinde.m3u8
 */
export function plItemsCacheName(plUri?: string) {
  return plUri ? `mopidy-playlist/${plUri}` : 'mopidy-playlist/unknown-playlist';
}

export function toPlItemsCacheName(plSelection: LocationSelection) {
  if (plSelection.type == 'DISK') {
    // e.g. m3u/colinde.m3u8
    const parts = decodeURIComponent(plSelection.uri).split('/');
    // has nothing to do with models.Ref.uri format (e.g. m3u:Marcin%20Patrzalek.m3u8)
    return `mopidy-playlist/m3u:${parts[parts.length - 1]}`;
  } else {
    return `mopidy-playlist/${plSelection.uri}`;
  }
}
