import { isM3uMpcRefUri, m3uMpcRefUriToFileName } from '../services/mpc';
import Selectable from './Selectable';

export function getNotFailed(result: UriPlAllocationResult) {
  return [...result.addedTo, ...result.removedFrom];
}

export function filterByMediaLocations<T extends MediaLocation>(
  mediaLocations: MediaLocation[],
  selections: T[]
) {
  return selections.filter((sel) => mediaLocations.find((ml) => ml.uri == sel.uri));
}

export interface UriPlAllocationResult {
  addedTo: MediaLocation[];
  removedFrom: MediaLocation[];
  failedToChange: MediaLocation[];
}

export interface LocationSelection extends MediaLocation, Selectable {}

export interface MediaLocation {
  type: string;
  uri: string;
  formattedUri: string;
  title: string;
}

export function uriToTitle(uri: string | null | undefined) {
  if (!uri) {
    return uri;
  } else if (uri.startsWith('file:///')) {
    const parts = decodeURIComponent(uri).split('/');
    if (parts.length > 0) {
      return parts[parts.length - 1];
    } else {
      return uri;
    }
  } else if (isM3uMpcRefUri(uri)) {
    return m3uMpcRefUriToFileName(uri);
  } else {
    return uri;
  }
}
