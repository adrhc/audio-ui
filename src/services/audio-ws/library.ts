import { post } from '../rest';
import { toQueryParams } from '../../lib/path-param-utils';

const DISK_PLAYLIST = '/audio-ui/api/disk-playlist';

export function createPlaylist(name: string) {
  return post<boolean>(`${DISK_PLAYLIST}?${toQueryParams(['name', encodeURI(name)])}`);
}
