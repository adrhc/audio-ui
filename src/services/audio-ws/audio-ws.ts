import { models } from 'mopidy';
import { get, post } from '../rest';
import { TrackSong, toTrackSong } from '../../domain/track-song';
import { toQueryParams } from '../../lib/path-param-utils';
import { Song } from '../../domain/song';
import * as audiows from './types';

const URI = '/audio-ui/api/audio-state';
const DISK_PLAYLIST = '/audio-ui/api/disk-playlist';
const MOPIDY_PLAYLIST = '/audio-ui/api/mopidy-playlist';

export type AudioServerState = {
  currentSong: TrackSong;
  streamTitle: string;
  pbStatus: string;
  baseVolume: number;
  mute: boolean;
  boost: number;
};

type RawAudioWSState = {
  tlTrack: models.TlTrack;
  streamTitle: string;
  playbackState: string;
  baseVolume: number;
  mute: boolean;
  boost: number;
};

export function reloadServerState() {
  return post<RawAudioWSState>(URI).then(toAudioServerState);
}

export function refreshSharedStateAndGet() {
  return get<RawAudioWSState>(URI).then(toAudioServerState);
}

export function createPlaylist(name: string) {
  return post<boolean>(`${DISK_PLAYLIST}?${toQueryParams(['name', encodeURI(name)])}`);
}

/**
 * alternative to getPlItems from mpc.ts
 */
export function getPlContent(imgMaxArea: number, uri: string): Promise<Song[]> {
  // Nginx decodes 1x the received requests so 1x encoded "m3u:[Radio Streams].m3u8"
  // becomes "m3u:[Radio Streams].m3u8" when passed to upstream (aka, java).
  //
  // "m3u:[Radio Streams].m3u8" contains special characters (i.e., space [ and ])
  // which must be encoded, otherwise the request is not passed to the Nginx's upstream!
  //
  // 2x encoded "m3u:[Radio Streams].m3u8" becomes "m3u%3A%5BRadio%20Streams%5D.m3u8"
  // for the upstream; PlaylistsService.getPlItems pass it to Mopidy but Mopidy can't
  // decode the encoded : character (i.e. %3A); solved with java.net.URLDecoder.decode.
  const doubleEncodedUri = encodeURIComponent(encodeURIComponent(uri));
  // console.log(`[getYTPlContent] double encoded ytUri = `, doubleEncodedUri);
  return get<audiows.RefWithImages[]>(`${MOPIDY_PLAYLIST}/${doubleEncodedUri}`).then((rwis) =>
    audiows.refWithImagesToSongs(rwis, imgMaxArea)
  );
}

export function getNoImgPlContent(uri: string): Promise<Song[]> {
  const doubleEncodedUri = encodeURIComponent(encodeURIComponent(uri));
  // console.log(`[getYTPlContent] double encoded ytUri = `, doubleEncodedUri);
  return get<audiows.RefWithImages[]>(`${MOPIDY_PLAYLIST}/${doubleEncodedUri}`).then((rwis) =>
    audiows.refWithImagesToSongs(rwis)
  );
}

function toAudioServerState({
  tlTrack,
  streamTitle,
  playbackState,
  baseVolume,
  mute,
  boost,
}: RawAudioWSState) {
  return {
    pbStatus: playbackState.toLowerCase(),
    baseVolume,
    boost,
    mute,
    currentSong: toTrackSong(tlTrack),
    streamTitle,
  } as AudioServerState;
}
