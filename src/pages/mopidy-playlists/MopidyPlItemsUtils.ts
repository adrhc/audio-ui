import { LocationSelection } from '../../domain/media-location';

export function plItemsCacheName(navigationUri?: string) {
  return navigationUri ? `mopidy-playlist/${navigationUri}` : 'mopidy-playlist/unknown-playlist';
}

export function toPlItemsCacheName(selection: LocationSelection) {
  if (selection.type == 'DISK') {
    const parts = decodeURIComponent(selection.uri).split('/');
    return `mopidy-playlist/m3u:${parts[parts.length - 1]}`;
  } else {
    return `mopidy-playlist/${selection.uri}`;
  }
}
