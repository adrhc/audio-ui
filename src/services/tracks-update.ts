import Mopidy from 'mopidy';
import { addUris, addUrisAfter } from './mpc';
import { getYTPlContent } from './audio-db/playlist';
import { addToHistory } from './audio-db/history';
import { Track } from '../domain/track';
import { Song } from '../domain/song';
import { play } from './player';
import { getMpcSortedPlContent } from './playlist';

/**
 * Get the playlist content from audio-db.
 */
export function addYtMusicPlAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  ytm: Song
) {
  // console.log(`[addYtMusicPlAfterAndRemember] playlist:`, ytm);
  return getYTPlContent(-1, ytm.uri).then((songs) => {
    if (songs.length) {
      addSongsAfterAndRemember(mopidy, after, ...songs);
    } else {
      return Promise.reject(`The playlist ${ytm.title} is empty!`);
    }
  });
}

/**
 * Get the playlist content from audio-db.
 */
export function addYtMusicPlAndRemember(mopidy: Mopidy | undefined, ytm: Song) {
  // console.log(`[addYtMusicPlAndRemember] playlist:`, ytm);
  return getYTPlContent(-1, ytm.uri).then((songs) => {
    if (songs.length) {
      addSongsAndRemember(mopidy, ...songs);
    } else {
      return Promise.reject(`The playlist ${ytm.title} is empty!`);
    }
  });
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function addMopidyPlAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  playlist: Song
) {
  console.log(`[addMopidyPlAfterAndRemember] playlist:`, playlist);
  return getMpcSortedPlContent(mopidy, playlist.uri).then((songs) => {
    if (songs.length) {
      addSongsAfterAndRemember(mopidy, after, ...songs);
    } else {
      return Promise.reject(`The playlist ${playlist.title} is empty!`);
    }
  });
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function addMopidyPlAndRemember(mopidy: Mopidy | undefined, playlist: Song) {
  console.log(`[addMopidyPlAndRemember] playlist:`, playlist);
  return getMpcSortedPlContent(mopidy, playlist.uri).then((songs) => {
    if (songs.length) {
      addSongsAndRemember(mopidy, ...songs);
    } else {
      return Promise.reject(`The playlist ${playlist.title} is empty!`);
    }
  });
}

export function addSongsAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  ...song: Song[]
) {
  if (after?.tlid == null) {
    return addSongsAndRemember(mopidy, ...song);
  } else {
    const uris = song.map((it) => it.uri);
    return addUrisAfter(mopidy, after.tlid, ...uris)?.then(addToHistory);
  }
}

export function addSongsAndRemember(mopidy: Mopidy | undefined, ...song: Song[]) {
  const uris = song.map((it) => it.uri);
  return addUrisAndRemember(mopidy, ...uris);
}

export function addUrisAndRemember(mopidy: Mopidy | undefined, ...uris: string[]) {
  return addUris(mopidy, ...uris)?.then(addToHistory);
}

export function addSongThenPlay(mopidy: Mopidy | undefined, song: Song) {
  return addUrisThenPlay(mopidy, song.uri);
}

export function addUrisThenPlay(mopidy: Mopidy | undefined, ...uris: string[]) {
  return addUris(mopidy, ...uris)?.then((tk) => {
    tk.length && play(mopidy, tk[0].tlid);
  });
}
