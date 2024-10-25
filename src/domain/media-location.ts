import { isM3uMpcRefUri, m3uMpcRefUriToDecodedFileName } from '../infrastructure/mpc/utils';
import Selectable from './Selectable';

const compare = new Intl.Collator('en', { caseFirst: 'upper', sensitivity: 'base' }).compare;

export function uriEqual(uri1: string, uri2: string) {
  // console.log(`uri1: ${fixUriEncoding(uri1)}`);
  // console.log(`uri2: ${fixUriEncoding(uri2)}`);
  return uri1 == uri2 || fixUriEncoding(uri1) == fixUriEncoding(uri2);
}

function fixUriEncoding(uri: string) {
  return uri?.replaceAll("'", '%27')?.replaceAll('(', '%28')?.replaceAll(')', '%29')?.replaceAll(',', '%2C');
}

export function getChanged(result: UriPlAllocationResult) {
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

export function sortMediaLocationsIfNotFromLocalPl<T extends MediaLocation>(
  uri: string,
  songsPromise: Promise<T[]>
): Promise<T[]> {
  if (isM3uMpcRefUri(uri)) {
    // keeping the playlist order
    return songsPromise;
  } else {
    // sorting the playlist
    return songsPromise.then(sortMediaLocations);
  }
}

export function sortMediaLocations<T extends MediaLocation>(ml: T[]) {
  return ml.sort((a, b) => compare(a.title, b.title));
}

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
    return m3uMpcRefUriToDecodedFileName(uri);
  } else {
    return uri;
  }
}
