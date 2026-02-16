import { removeVoid } from '../../lib/rest';

export const PLAYLIST_ENTRY = '/audio-ui/db-api/plentry';

export function removeFromLocalPl(plFileName: string, songUri: string, songTitle: string): Promise<void> {
  return removeVoid(PLAYLIST_ENTRY, JSON.stringify({ plFileName, songUri, songTitle }));
}
