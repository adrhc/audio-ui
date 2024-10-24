import { LocationSelection } from '../../../domain/media-location';
import { m3uMpcRefUriToDecodedFileName } from '../../mpc/mpc';
import { MediaLocation } from '../types';
import { toPlMediaLocation } from '../converters';
import * as app from '../../../domain/media-location';
import * as db from '../types';

export interface UriPlAllocationResult {
  addedTo: MediaLocation[];
  removedFrom: MediaLocation[];
  failedToChange: MediaLocation[];
}

/**
 * DB/UriPlAllocationResult -> UriPlAllocationResult
 */
export function toUriPlAllocationResult(r: UriPlAllocationResult): app.UriPlAllocationResult {
  return {
    addedTo: toMediaLocations(r.addedTo),
    removedFrom: toMediaLocations(r.removedFrom),
    failedToChange: toMediaLocations(r.failedToChange),
  };
}

/**
 * DB/MediaLocation[] -> MediaLocation[]
 */
export function toMediaLocations(audioDbLocations: db.MediaLocation[]): app.MediaLocation[] {
  return audioDbLocations.map(toPlMediaLocation);
}

export function toPlContentUpdateRequest(diskPlUri: string, selections: LocationSelection[]) {
  return { playlistUri: m3uMpcRefUriToDecodedFileName(diskPlUri), selections };
}

/**
 * uri + title + LocationSelection[] -> DB/LocationSelections
 */
export function toAudioDbLocationSelections(
  uri: string,
  title: string | null | undefined,
  selections: LocationSelection[]
): db.LocationSelections {
  return { uri, title, selections: selections.map(toAudioDbLocationSelection) };
}

/**
 * LocationSelection -> DB/LocationSelection
 */
export function toAudioDbLocationSelection(location: LocationSelection): db.LocationSelection {
  const { type, title, uri } = location;
  return { location: { type, name: title, uri }, selected: location.selected };
}
