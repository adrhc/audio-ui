import { models } from 'mopidy';
import { Song, formatUri } from './song';
import Selectable from './Selectable';
import { uriEqual } from './media-location';

export function areSameTrack(tk1: TrackSong, tk2?: TrackSong): boolean {
  return tk1.tlid == tk2?.tlid && tk1.uri == tk2.uri;
}

export function removeSong(songs: TrackSong[], song: TrackSong) {
  const idxToRemove = songs.indexOf(song);
  const newSongs = songs.filter((it) => it.tlid != song.tlid);
  let songCloseToLastRemoved;
  if (newSongs.length > idxToRemove) {
    songCloseToLastRemoved = newSongs[idxToRemove];
  } else if (newSongs.length > 0) {
    songCloseToLastRemoved = newSongs[idxToRemove - 1];
  }
  return { songs: newSongs, songCloseToLastRemoved };
}

export function toSelectableTrackSong(songs: Song[], track: TrackSong): SelectableTrackSong {
  return { ...track, selected: !!songs.find((s) => uriEqual(s.uri, track.uri)) };
}

export interface SelectableTrackSong extends TrackSong, Selectable {}

export interface CurrentSongAware {
  currentSong?: TrackSong | null;
}

export interface TrackSong extends Song {
  tlid: number;
  artists?: string | null;
}

export function songEqual(song: Song, currentSong?: Song | null) {
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
