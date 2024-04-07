import Mopidy, { models } from 'mopidy';
import { getArtists, getCurrentTlTrack, logTlTrack } from '../mpc';

export const LOG_TLT = false;

export type SongAndArtists = {
  song?: string | null;
  artists?: string | null;
};

export function collectSongAndArtists(onSuccess: (sa: SongAndArtists) => void, mopidy?: Mopidy | null) {
  getCurrentTlTrack((tlt) => {
    LOG_TLT && logTlTrack(tlt);
    onSuccess(toSongAndArtists(tlt));
  }, mopidy);
}

export function toSongAndArtists(tlt: models.TlTrack | null) {
  const song = tlt?.track?.name ?? tlt?.track?.comment ?? tlt?.track?.uri;
  const artists = getArtists(tlt?.track);
  return { song, artists } as SongAndArtists;
}
