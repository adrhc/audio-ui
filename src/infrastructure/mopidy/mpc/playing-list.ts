import Mopidy, { models } from 'mopidy';
import { MOPIDY_DISCONNECTED_ERROR } from '../../../constants';

export function clearTrackList(mopidy: Mopidy | undefined) {
  return mopidy?.tracklist == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.tracklist.clear();
}

export function removeTlid(mopidy: Mopidy | undefined, tlid: number) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : // @ts-expect-error tlid is asked to be string though it should be number
      mopidy.tracklist.remove({ criteria: { tlid: [tlid] } });
}

export function getTlTracks(mopidy?: Mopidy): Promise<models.TlTrack[]> {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.getTlTracks();
}

export function getCurrentTlTrack(mopidy?: Mopidy): Promise<models.TlTrack | null> {
  return mopidy?.playback == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playback.getCurrentTlTrack();
}

export function addUrisToTrackListAfter(
  mopidy: Mopidy | undefined,
  afterTlid: number,
  ...uris: string[]
): Promise<models.TlTrack[]> {
  const tracklist = mopidy?.tracklist;
  if (!tracklist) {
    return Promise.reject(MOPIDY_DISCONNECTED_ERROR);
  }
  return tracklist.index({ tlid: afterTlid })?.then((index) => {
    if (index == null) {
      return addUrisToTrackList(mopidy, ...uris);
    } else {
      return addUrisToTrackListAtPosition(tracklist, uris, index + 1);
    }
  });
}

/**
 * This is the not-async version of addUrisToTrackListIn2Steps.
 */
export function addUrisToTrackList(mopidy: Mopidy | undefined, ...uris: string[]): Promise<models.TlTrack[]> {
  const tracklist = mopidy?.tracklist;
  if (!tracklist) {
    return Promise.reject(MOPIDY_DISCONNECTED_ERROR);
  } else if (!uris.length) {
    // console.log(`[addUrisToTrackList] uris:`, uris);
    return Promise.reject("Can't add an empty uri list!");
  } else {
    // console.log(`[addUris] uris:`, uris);
    // return mopidy.tracklist.add({ uris });
    return addUrisToTrackListIn2Steps(tracklist, uris);
  }
}

async function addUrisToTrackListIn2Steps(
  tracklist: Mopidy.core.TracklistController,
  uris: string[]
): Promise<models.TlTrack[]> {
  if (uris.length === 0) return [];
  /* const resolvedLists = await Promise.all(uris.map(resolvePlaylistUri));
  uris = resolvedLists.flat();
  if (uris.length === 0) return []; */
  const [firstUri, ...restUris] = uris;
  const firstTracks = await addUrisToTrackListAtPosition(tracklist, [firstUri]);
  console.log(`[addUrisToTrackListIn2Steps] restUris:`, restUris);
  if (restUris.length > 0) {
    const restTracks = await addUrisToTrackListAtPosition(tracklist, restUris);
    return [...firstTracks, ...restTracks];
  } else {
    return firstTracks;
  }
}

function addUrisToTrackListAtPosition(
  tracklist: Mopidy.core.TracklistController,
  uris: string[],
  position?: number | null
): Promise<models.TlTrack[]> {
  if (!uris.length) {
    // console.log(`[addUrisToTrackListAtPosition] uris:`, uris);
    return Promise.reject("Can't add an empty uri list!");
  }
  uris = uris.filter(isSupportedUri);
  if (!uris.length) {
    return Promise.reject('No supported URIs!');
  } else if (position != null) {
    return tracklist.add({ uris, at_position: position });
  } else {
    return tracklist.add({ uris });
  }
}

/**
 * curl -s http://stream2.srr.ro:8002/listen.pls
 * gst-play-1.0 http://stream2.srr.ro:8002/listen.pls
 *
 * curl -s https://www.itsybitsy.ro/itsybitsy.m3u
 * gst-play-1.0 https://www.itsybitsy.ro/itsybitsy.m3u
 */
function isSupportedUri(uri: string | null): boolean {
  return uri != null && !uri.endsWith('.pls');
  // (!uri.startsWith('http') || (!uri.endsWith('.pls') && !uri.endsWith('.m3u') && !uri.endsWith('.m3u8')))
}

/* export async function resolvePlaylistUri(uri: string): Promise<string[]> {
  if (!uri.startsWith('http')) {
    return [uri]; // Not a remote playlist — return as-is
  }

  if (!uri.endsWith('.pls') && !uri.endsWith('.m3u') && !uri.endsWith('.m3u8')) {
    return [uri]; // Not a recognized playlist format
  }

  console.log('[resolvePlaylistUri] uri = ', uri);
  const response = await fetch(uri);
  const text = await response.text();

  if (uri.endsWith('.pls')) {
    const newUrl = [...text.matchAll(/^File\d+=(.+)$/gm)].map((match) => match[1].trim());
    console.log(`${uri} - ${newUrl}`);
    return newUrl;
  }

  if (uri.endsWith('.m3u') || uri.endsWith('.m3u8')) {
    const newUrl = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
    console.log(`${uri} - ${newUrl}`);
    return newUrl;
  }

  return [uri];
} */
