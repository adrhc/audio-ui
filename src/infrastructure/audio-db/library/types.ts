import { LocationSelection, MediaLocation } from '../../../domain/media-location/types';
import { m3uMpcRefUriToDecodedFileName } from '../../mopidy/utils';
import { toPlMediaLocation } from '../converters';
import * as db from '../types';

/**
 * DB/LocationSelections -> LocationSelection[]
 */
export function toPlSelections(audioDbMarkedPls: db.LocationSelections): LocationSelection[] {
  return audioDbMarkedPls.selections.map(toPlSelection);
}

/**
 * DB/LocationSelection -> LocationSelection
 */
export function toPlSelection(audioDbLocationSelection: db.LocationSelection): LocationSelection {
  return {
    ...toPlMediaLocation(audioDbLocationSelection.location),
    selected: audioDbLocationSelection.selected,
  };
}

/**
 * Works with playlists loaded from MPC (i.e. models.Ref) but not audio-web-services.
 */
export function toDiskPlaylistRemoveRequest(playlist: MediaLocation) {
  const { type, title, uri } = playlist;
  // console.log(`[toDbPlMediaLocation] uri:`, m3uMpcRefUriToFileName(uri));
  return { type, name: title, uri, fileName: m3uMpcRefUriToDecodedFileName(uri) };
}
