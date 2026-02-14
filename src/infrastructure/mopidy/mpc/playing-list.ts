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

export function addUrisToTrackListIn2StepsAfter(
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
      return addUrisToTrackListIn2Steps(tracklist, uris);
    } else {
      return addUrisToTrackListIn2Steps(tracklist, uris, index + 1);
    }
  });
}

/**
 * It rejects if all URIs are unsupported or if the list is empty!
 */
export async function addUrisToTrackListIn2Steps(
  tracklist: Mopidy.core.TracklistController | undefined,
  uris: string[],
  position?: number | null
): Promise<models.TlTrack[]> {
  if (!tracklist) {
    return Promise.reject(MOPIDY_DISCONNECTED_ERROR);
  }
  const supportedUris = uris.filter(isSupportedUri);
  if (!supportedUris.length) {
    if (uris.length > 0) {
      return Promise.reject('The provided URIs are not supported!');
    } else {
      return Promise.reject("Can't add an empty uri list!");
    }
  }
  const [firstUri, ...restUris] = supportedUris;
  const firstTracks = await addUrisToTrackListAtPosition(tracklist, [firstUri], position);
  // console.log(`[addUrisToTrackListIn2Steps] restUris:`, restUris);
  if (restUris.length > 0) {
    const restTracks = await addUrisToTrackListAtPosition(
      tracklist,
      restUris,
      position != null ? position + 1 : undefined
    );
    return [...firstTracks, ...restTracks];
  } else {
    return firstTracks;
  }
}

/**
 * It rejects if all URIs are unsupported or if the list is empty!
 */
function addUrisToTrackListAtPosition(
  tracklist: Mopidy.core.TracklistController,
  uris: string[],
  position?: number | null
): Promise<models.TlTrack[]> {
  const supportedUris = uris.filter(isSupportedUri);
  if (!supportedUris.length) {
    if (uris.length > 0) {
      // console.log(`[addUrisToTrackListAtPosition] the provided URIs are not supported, uris:`, uris);
      return Promise.reject('The provided URIs are not supported!');
    } else {
      // console.log(`[addUrisToTrackListAtPosition] Can't add an empty uri list!`);
      return Promise.reject("Can't add an empty uri list!");
    }
  } else if (position != null) {
    return tracklist.add({ uris: supportedUris, at_position: position });
  } else {
    return tracklist.add({ uris: supportedUris });
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
