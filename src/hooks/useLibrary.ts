import { useCallback, useContext } from 'react';
import { createPlaylist as remotelyCreatePlaylist } from '../services/audio-ws/audio-ws';
import { LoadingStateOrProvider, SustainVoidFn } from './useSustainableState';
import { AppContext } from './AppContext';
import { Song } from '../domain/song';
import { removeDiskPlaylist } from '../services/audio-db/audio-db';

export interface UseLibrary {
  createPlaylist: (plName: string) => Promise<void>;
  removePlaylist: (playlist: Song) => Promise<void>;
}

export default function useLibrary<S>(sustain: SustainVoidFn<S>): UseLibrary {
  const { clearLocalLibraryCache, credentials } = useContext(AppContext);

  const createPlaylist = useCallback(
    (playlistName: string) => {
      console.info(`[UseLibrary.createPlaylist] playlistName:`, playlistName);
      const failMessage = `Failed to create ${playlistName} playlist!`;
      clearLocalLibraryCache();
      return sustain(
        remotelyCreatePlaylist(playlistName).then((success) => {
          if (!success) {
            return Promise.reject({ error: failMessage } as Partial<LoadingStateOrProvider<S>>);
          }
        }),
        failMessage
      );
    },
    [clearLocalLibraryCache, sustain]
  );

  const removePlaylist = useCallback(
    (playlist: Song) => {
      if (!credentials.isValid()) {
        console.info(`[UseLibrary.removePlaylist] not allowed to remove the playlist:`, playlist);
        return Promise.reject({ error: `You must authenticate to remove the playlist ${playlist.title}!` });
      }
      console.info(`[UseLibrary.removePlaylist] playlist:`, playlist);
      const failMessage = `Failed to remove the playlist ${playlist.formattedUri}!`;
      clearLocalLibraryCache();
      return sustain(
        removeDiskPlaylist(playlist).then((removed) => {
          if (!removed) {
            // console.log(`Couldn't find the playlist to remove! ${playlist.formattedUri}`);
            return Promise.reject({ error: failMessage });
          }
        }),
        failMessage
      );
    },
    [clearLocalLibraryCache, credentials, sustain]
  );

  return { createPlaylist, removePlaylist };
}
