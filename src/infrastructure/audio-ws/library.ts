import { post } from '../../lib/rest';

const DISK_PLAYLIST = '/audio-ui/api/disk-playlist';

export function createPlaylist(name: string) {
  return post<boolean>(DISK_PLAYLIST, JSON.stringify({name}));
}
