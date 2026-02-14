import Mopidy from 'mopidy';
import { getMpcSortedNoImgPlContent } from '../../playlist';
import { addSongsAfter, addSongs } from './add-song';
import { Track } from '../../../domain/track';
import { Song } from '../../../domain/song';

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function addMopidyPlAfter(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  playlist: Song
) {
  console.log(`[addMopidyPlAfter] playlist:`, playlist);
  return getMpcSortedNoImgPlContent(mopidy, playlist.uri).then((songs) => {
    if (songs.length) {
      addSongsAfter(mopidy, after, ...songs);
    } else {
      return Promise.reject(`The playlist ${playlist.title} is empty!`);
    }
  });
}

/**
 * Get the playlist content from Mopidy WebSocket.
 */
export function addMopidyPl(mopidy: Mopidy | undefined, playlist: Song) {
  console.log(`[addMopidyPl] playlist:`, playlist);
  return getMpcSortedNoImgPlContent(mopidy, playlist.uri).then((songs) => {
    if (songs.length) {
      addSongs(mopidy, ...songs);
    } else {
      return Promise.reject(`The playlist ${playlist.title} is empty!`);
    }
  });
}
