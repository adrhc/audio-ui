import { models } from 'mopidy';
import { Track, toTrack } from '../../../domain/track';

export type AudioServerState = {
  currentSong: Track;
  streamTitle: string;
  pbStatus: string;
  baseVolume: number;
  mute: boolean;
  boost: number;
};

export type RawAudioWSState = {
  tlTrack: models.TlTrack;
  streamTitle: string;
  playbackState: string;
  baseVolume: number;
  mute: boolean;
  boost: number;
};

export function toAudioServerState({
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
