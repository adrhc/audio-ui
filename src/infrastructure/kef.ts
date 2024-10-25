import { get, post } from '../lib/rest';

const ROOT = '/audio-ui/api/keflsx';

export type KefLSXState = { volume: number; muted?: boolean; power?: boolean };

export function getState() {
  return get<KefLSXState>(ROOT);
}

export function setPower(power: boolean) {
  if (power) {
    return post<KefLSXState>(`${ROOT}/start`).then(unmute);
  } else {
    return post<KefLSXState>(`${ROOT}/stop`);
  }
}

export function setVolume(volume: number) {
  return post<KefLSXState>(`${ROOT}/volume?volume=${volume}`);
}

export function unmute() {
  return post<KefLSXState>(`${ROOT}/unmute`);
}
