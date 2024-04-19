import { get, post } from "./rest";

export type KefLSXState = { muted?: boolean; volume?: number; power?: boolean };

export function getState() {
    return get<KefLSXState>('/api/keflsx');
}

export function setPower(power: boolean) {
    return post<KefLSXState>(`/api/keflsx/${power ? 'start' : 'stop'}`);
}
