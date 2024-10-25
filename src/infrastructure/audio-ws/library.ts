import { post } from '../../lib/rest';
import { toQueryParams } from '../../lib/url-search-params';

const DISK_PLAYLIST = '/audio-ui/api/disk-playlist';

export function createPlaylist(name: string) {
  return post<boolean>(`${DISK_PLAYLIST}?${toQueryParams(['name', encodeURI(name)])}`);
}
