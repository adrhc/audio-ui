import Mopidy from 'mopidy';
import { getMpcSortedNoImgPlContent } from '../../playlist';
import { addSongsAfterAndRemember, addSongsAndRemember } from './add-song';
import { Track } from '../../../domain/track';
import { Song } from '../../../domain/song';

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function addMopidyPlAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  playlist: Song
) {
  console.log(`[addMopidyPlAfterAndRemember] playlist:`, playlist);
  return getMpcSortedNoImgPlContent(mopidy, playlist.uri).then((songs) => {
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
  return getMpcSortedNoImgPlContent(mopidy, playlist.uri).then((songs) => {
    if (songs.length) {
      addSongsAndRemember(mopidy, ...songs);
    } else {
      return Promise.reject(`The playlist ${playlist.title} is empty!`);
    }
  });
}
