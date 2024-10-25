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

export function addUrisAfter(mopidy: Mopidy | undefined, afterTlid: number, ...uris: string[]) {
  const tracklist = mopidy?.tracklist;
  return tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : tracklist.index({ tlid: afterTlid })?.then((index) => {
        if (index == null) {
          return addUris(mopidy, ...uris);
        } else {
          return tracklist.add({ uris, at_position: index + 1 });
        }
      });
}

export function addUris(mopidy: Mopidy | undefined, ...uris: string[]) {
  if (uris.length == 0) {
    return Promise.reject("Can't add an empty uri list to the playlist!");
  } else if (mopidy?.tracklist == null) {
    return Promise.reject(MOPIDY_DISCONNECTED_ERROR);
  } else {
    // console.log(`[addUris] uris:`, uris);
    return mopidy.tracklist.add({ uris });
  }
}
