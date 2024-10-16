import { useCallback, useContext } from 'react';
import { Song, SongsAware } from '../domain/song';
import { SetLoadingState } from '../lib/sustain';
import { SustainVoidFn } from './useSustainableState';
import { getLocalPlaylists } from '../services/pl-content';
import { AppContext } from './AppContext';
import useLibrary from './useLibrary';

export interface UseSongsAwareState {
  loadLocalLibrary: () => Promise<void>;
  createPlaylist: (plName: string) => Promise<void>;
  removePlaylist: (playlist: Song) => Promise<void>;
}

export default function useLibraryAwareState<S extends SongsAware>(
  sustain: SustainVoidFn<S>,
  setState: SetLoadingState<S>
): UseSongsAwareState {
  const { mopidy } = useContext(AppContext);
  const { createPlaylist, removePlaylist: removePlaylistWithNoStateChange } = useLibrary(sustain);

  const loadLocalLibrary = useCallback(() => {
    console.log(`[useCachedSongsScrollable.loadLocalLibrary] loading the local library`);
    return sustain(
      getLocalPlaylists(mopidy).then((songs) => ({ songs }) as Partial<S>),
      `Failed to load the local library!`
    );
  }, [mopidy, sustain]);

  const removePlaylist = useCallback(
    (playlist: Song) =>
      removePlaylistWithNoStateChange(playlist).then(() =>
        setState((old) => ({ ...old, songs: old.songs.filter((s) => s.uri != playlist.uri) }))
      ),
    [removePlaylistWithNoStateChange, setState]
  );

  return { loadLocalLibrary, createPlaylist, removePlaylist };
}
