import Mopidy, { models } from 'mopidy';
import { MOPIDY_DISCONNECTED_ERROR } from '../../../constants';
import { UriImagesMap } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlContent(mopidy: Mopidy | undefined, uri: string): Promise<models.Ref<any>[]> {
  return mopidy?.playlists == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playlists.getItems({ uri }).then((it) => it ?? []);
}

/**
 * models.Ref.uri example: m3u:Marcin%20Patrzalek.m3u8
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlaylists(mopidy: Mopidy | undefined): Promise<models.Ref<any>[]> {
  return mopidy?.playlists == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playlists.asList();
}

export function getImages(mopidy: Mopidy | undefined, uris: string[]): Promise<UriImagesMap> {
  return mopidy?.library == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.library.getImages({ uris });
}
