import { useCallback, useContext } from 'react';
import { isPlaylist, isYtMusicPl, Song, LastUsedMediaAware } from '../domain/song';
import { SustainVoidFn } from './useSustainableState';
import { AppContext } from './AppContext';
import {
  addSongs,
  addSongsAfterAndRemember,
  addSongsAndRemember,
  addSongThenPlay as remotelyAddSongThenPlay,
} from '../infrastructure/mopidy/playing-list/add-song';
import { CurrentSongAware } from '../domain/track';
import { addMopidyPl, addMopidyPlAfter } from '../infrastructure/mopidy/playing-list/add-mopidy-pl';
import { addYtMusicPl, addYtMusicPlAfter } from '../infrastructure/mopidy/playing-list/add-yt-pl';

export type AddManySongsFn = (songs: Song[], addToHistory?: boolean) => Promise<void>;

export interface UsePlayingList extends CurrentSongAware {
  addSongThenPlay: (song: Song) => void;
  addManySongs: AddManySongsFn;
  addSongOrPlaylist: (song: Song) => void;
  insertSongOrPlaylist: (song: Song) => void;
}

export function usePlayingList<S extends LastUsedMediaAware>(sustain: SustainVoidFn<S>): UsePlayingList {
  const { mopidy, currentSong } = useContext(AppContext);

  const addSongThenPlay = useCallback(
    (song: Song) => {
      // console.log(`[useSongsList:addSongThenPlay] song:\n`, song);
      sustain(
        remotelyAddSongThenPlay(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<S>),
        { error: `Failed to start ${song.title}!`, lastUsed: song }
      );
    },
    [mopidy, sustain]
  );

  const addManySongs = useCallback(
    (songs: Song[], addToHistory?: boolean) => {
      console.log(`[usePlayingList:addManySongs] addToHistory: ${addToHistory}, songs:\n`, songs);
      if (addToHistory) {
        return sustain(addSongsAndRemember(mopidy, ...songs), `Failed to add!`);
      } else {
        return sustain(addSongs(mopidy, ...songs).then(() => undefined), `Failed to add!`);
      }
    },
    [mopidy, sustain]
  );

  const addSongOrPlaylist = useCallback(
    (song: Song) => {
      // console.log(`[usePlayingList:addSongOrPlaylist] song:\n`, song);
      // addYtMusicPl uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      let addFn;
      if (isPlaylist(song)) {
        addFn = isYtMusicPl(song) ? addYtMusicPl : addMopidyPl;
      } else {
        addFn = addSongsAndRemember;
      }
      sustain(
        addFn(mopidy, song)?.then(() => ({ lastUsed: song }) as Partial<S>),
        { error: `Failed to add ${song.title}!`, lastUsed: song }
      );
    },
    [mopidy, sustain]
  );

  const insertSongOrPlaylist = useCallback(
    (song: Song) => {
      //   console.log(`[usePlayingList.insertSongOrPlaylist] song:\n`, song);
      let insertFn;
      if (isPlaylist(song)) {
        insertFn = isYtMusicPl(song) ? addYtMusicPlAfter : addMopidyPlAfter;
      } else {
        insertFn = addSongsAfterAndRemember;
      }
      sustain(
        insertFn(mopidy, currentSong, song)?.then(() => ({ lastUsed: song }) as Partial<S>),
        { error: `Failed to start ${song.title}!`, lastUsed: song }
      );
    },
    [mopidy, sustain, currentSong]
  );

  return { currentSong, addSongThenPlay, addManySongs, addSongOrPlaylist, insertSongOrPlaylist };
}
