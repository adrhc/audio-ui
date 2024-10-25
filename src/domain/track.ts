import { models } from 'mopidy';
import { Song, formatUri } from './song';
import Selectable from './Selectable';
import { uriEqual } from './location/utils';

export function areSameTrack(tk1: Track, tk2?: Track | null): boolean {
  return tk1.tlid == tk2?.tlid && tk1.uri == tk2.uri;
}

export function removeTrack(tracks: Track[], trackToRemove: Track) {
  const idxToRemove = tracks.indexOf(trackToRemove);
  const remainingTracks = tracks.filter((it) => it.tlid != trackToRemove.tlid);
  let songCloseToLastRemoved;
  if (remainingTracks.length > idxToRemove) {
    songCloseToLastRemoved = remainingTracks[idxToRemove];
  } else if (remainingTracks.length > 0) {
    songCloseToLastRemoved = remainingTracks[idxToRemove - 1];
  }
  return { songs: remainingTracks, songCloseToLastRemoved };
}

export function toSelectableTrack(songs: Song[], track: Track): SelectableTrack {
  return { ...track, selected: !!songs.find((s) => uriEqual(s.uri, track.uri)) };
}

export interface SelectableTrack extends Track, Selectable {}

export interface CurrentSongAware {
  currentSong?: Track | null;
}

export interface Track extends Song {
  tlid: number;
  artists?: string | null;
}

export function songEqual(song: Song, currentSong?: Song | null) {
  return song.uri == currentSong?.uri;
}

export function title(sa?: Track) {
  return sa?.artists ? `${sa.title} - ${sa.artists}` : sa?.title;
}

export function toTrack(tlt: models.TlTrack | null): Track | null {
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
