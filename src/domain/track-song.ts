import { models } from 'mopidy';
import { Song, formatUri } from './song';

export type TrackSong = Song & {
  tlid: number;
  artists?: string | null;
};

export function songEquals(song: Song, currentSong?: TrackSong) {
  return song.uri == currentSong?.uri;
}

export function title(sa?: TrackSong) {
  return sa?.artists ? `${sa.title} - ${sa.artists}` : sa?.title;
}

export function toTrackSong(tlt: models.TlTrack | null): TrackSong | null {
  // logTlTrack(tlt);
  if (tlt?.track == null) {
    return null;
  }
  const track = tlt.track;
  const title = track.name ?? track.uri;
  const artists = getArtists(track);
  const uri = track.uri ?? track.album?.uri ?? track.artists?.[0] ?? track.artists[0];
  return { tlid: tlt.tlid, title, artists, uri, formattedUri: formatUri(uri)!, type: 'TRACK' };
}

export function getArtists(track: models.Track) {
  return track.artists?.map((a) => a.name).join(', ');
}
