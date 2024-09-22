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
  return get<audiows.RefWithImages[]>(`${MOPIDY_PLAYLIST}/${encodeURIComponent(encodeURIComponent(uri))}`).then((rwis) =>
    audiows.refWithImagesToSongs(imgMaxArea, rwis)
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
