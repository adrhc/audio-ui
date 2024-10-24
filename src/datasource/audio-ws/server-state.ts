import { models } from 'mopidy';
import { Track, toTrack } from '../../domain/track';
import { get, post } from '../../services/rest';

const URI = '/audio-ui/api/audio-state';

export type AudioServerState = {
  currentSong: Track;
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
    currentSong: toTrack(tlTrack),
    streamTitle,
  } as AudioServerState;
}
