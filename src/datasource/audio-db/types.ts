import { models } from 'mopidy';
import Selectable from '../../domain/Selectable';

export const YOUTUBE_PLAYLIST = '/audio-ui/db-api/youtube/playlist';
export const DISK_PLAYLIST = '/audio-ui/db-api/disk/playlist';

export interface SongsPage {
  entries: Song[];
}

export interface LocationSelections {
  selections: LocationSelection[];
  uri: string;
  title?: string | null;
}

export interface LocationSelection extends Selectable {
  location: MediaLocation;
}

export interface Song {
  location: MediaLocation;
  title: string;
  thumbnails?: models.Image[];
}

/* export interface Playlist {
  location: MediaLocation;
  title: string;
} */

export interface MediaLocation {
  type: string;
  name?: string;
  uri: string;
}
