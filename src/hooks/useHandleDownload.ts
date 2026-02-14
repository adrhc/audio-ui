import { useCallback, useContext } from 'react';
import { MediaLocation } from '../domain/location/types';
import { formatFileURI } from '../domain/song';
import { downloadTrack } from '../infrastructure/audio-db/download';
import { AppContext } from './AppContext';
import { SustainVoidFn } from './useSustainableState';

interface DownloadAware {
  downloadedUris: string[];
}

export default function useHandleDownload<S extends DownloadAware>(
  sustain: SustainVoidFn<S>,
  downloadedUris: string[]
) {
  const { setNotification } = useContext(AppContext);

  return useCallback(
    (song: MediaLocation) => {
      sustain(
        downloadTrack(song.uri).then((response) => {
          const formattedURI = formatFileURI(response.fileURI);
          setNotification(
            response.alreadyDownloaded
              ? `Already downloaded ${song.title} at ${formattedURI}`
              : `Downloaded ${song.title} to ${formattedURI}`
          );
          return {
            downloadedUris: [
              ...downloadedUris,
              ...(downloadedUris.includes(song.uri) ? [] : [song.uri]),
            ],
          } as Partial<S>;
        }),
        `Failed to download ${song.title}!`
      );
    },
    [downloadedUris, setNotification, sustain]
  );
}
