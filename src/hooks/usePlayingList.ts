import { useCallback, useContext } from 'react';
import { isPlaylist, isYtMusicPl, Song, LastUsedMediaAware } from '../domain/song';
import { SustainVoidFn } from './useSustainableState';
import { AppContext } from './AppContext';
import {
  addMopidyPlAfterAndRemember,
  addMopidyPlAndRemember,
  addSongsAfterAndRemember,
  addSongsAndRemember,
  addSongThenPlay as remotelyAddSongThenPlay,
  addYtMusicPlAfterAndRemember,
  addYtMusicPlAndRemember,
} from '../services/tracklist';
import { CurrentSongAware } from '../domain/track-song';

export type AddManySongsFn = (songs: Song[]) => void;

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
    (songs: Song[]) => {
      // console.log(`[usePlayingList:addManySongs] songs:\n`, songs);
      sustain(addSongsAndRemember(mopidy, ...songs), `Failed to add!`);
    },
    [mopidy, sustain]
  );

  const addSongOrPlaylist = useCallback(
    (song: Song) => {
      //   console.log(`[usePlayingList:addSongOrPlaylist] song:\n`, song);
      // addYTMPlAndRemember uses /playlist/content instead of Mopidy to replace "ytmusic:" with "youtube:"
      let addFn;
      if (isPlaylist(song)) {
        addFn = isYtMusicPl(song) ? addYtMusicPlAndRemember : addMopidyPlAndRemember;
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
        insertFn = isYtMusicPl(song) ? addYtMusicPlAfterAndRemember : addMopidyPlAfterAndRemember;
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
