import { get, post } from '../../../lib/rest';
import { RawAudioWSState, toAudioServerState } from './types';

const URI = '/audio-ui/api/audio-state';

export function reloadServerState() {
  return post<RawAudioWSState>(URI).then(toAudioServerState);
}

export function refreshSharedStateAndGet() {
  return get<RawAudioWSState>(URI).then(toAudioServerState);
}
