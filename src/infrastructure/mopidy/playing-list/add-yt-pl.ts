import Mopidy from 'mopidy';
import { getYTPlContent } from '../../audio-db/playlist/playlist';
import { addSongsAfter, addSongs } from './add-song';
import { Track } from '../../../domain/track';
import { Song } from '../../../domain/song';

/**
 * Get the playlist content from audio-db.
 */
export function addYtMusicPlAfter(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  ytm: Song
) {
  // console.log(`[addYtMusicPlAfterAndRemember] playlist:`, ytm);
  return getYTPlContent(-1, ytm.uri).then((songs) => {
    if (songs.length) {
      addSongsAfter(mopidy, after, ...songs);
    } else {
      return Promise.reject(`The playlist ${ytm.title} is empty!`);
    }
  });
}

/**
 * Get the playlist content from audio-db.
 */
export function addYtMusicPl(mopidy: Mopidy | undefined, ytm: Song) {
  // console.log(`[addYtMusicPlAndRemember] playlist:`, ytm);
  return getYTPlContent(-1, ytm.uri).then((songs) => {
    if (songs.length) {
      addSongs(mopidy, ...songs);
    } else {
      return Promise.reject(`The playlist ${ytm.title} is empty!`);
    }
  });
}
