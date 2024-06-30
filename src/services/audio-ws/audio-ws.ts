import { models } from 'mopidy';
import { get, post } from '../rest';
import { TrackSong, toTrackSong } from '../../domain/track-song';
import { toQueryParams } from '../../lib/path-param-utils';

const URI = '/audio-ui/api/audio-state';
const PLAYLIST_URI = '/audio-ui/api/playlist';

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
  return post<boolean>(`${PLAYLIST_URI}?${toQueryParams(['name', encodeURI(name)])}`);
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
