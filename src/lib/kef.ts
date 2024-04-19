import { get, post } from './rest';

const ROOT = '/audio-ui/api/keflsx';

export type KefLSXState = { muted?: boolean; volume?: number; power?: boolean };

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

export function unmute() {
  return post<KefLSXState>(`${ROOT}/unmute`);
}
