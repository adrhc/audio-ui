import { get, post } from "./rest";

const ROOT = '/audio-ui/api/keflsx';

export type KefLSXState = { muted?: boolean; volume?: number; power?: boolean };

export function getState() {
    return get<KefLSXState>(ROOT);
}

export function setPower(power: boolean) {
    return post<KefLSXState>(`${ROOT}/${power ? 'start' : 'stop'}`);
}

export function unmute() {
    return post<KefLSXState>(`${ROOT}/unmute`);
}
