import _ from 'lodash';
import { get, post, removeVoid } from './rest';

const ROOT = '/easyeffects/api/ee';

export type EEPresets = { input: string[]; output: string[] };
export interface EEPreset { name: string; amount: number; blend: number; harmonics: number; floor: number; scope: number }

export function areEqual(source: EEPreset, updated: EEPreset) {
  // console.log(`[areEqual] source:`, source);
  // console.log(`[areEqual] updated:`, updated);
  return _.isMatchWith(source, updated, (_value, _other, key) =>
    key == 'loading' || key == 'error' ? true : undefined
  );
}

export function floorActive(preset: EEPreset) {
  return preset.floor > 0;
}

export function newPreset(name?: string | null): EEPreset {
  return {
    name: name ?? '',
    amount: 0,
    blend: 0,
    harmonics: 8.5,
    floor: 0,
    scope: 250,
  };
}

export function updatePreset(preset: EEPreset) {
  return post<EEPreset>(`${ROOT}/${preset.name}`, JSON.stringify(preset));
}

export function removePreset<T>(preset: string) {
  return removeVoid(`${ROOT}/${preset}`) as Promise<T>;
}

export function getPreset(preset: string) {
  return get<EEPreset>(`${ROOT}/${preset}`);
}

export function getPresets() {
  return get<EEPresets>(ROOT);
}

export function getLastUsed() {
  return get<string>(`${ROOT}/last-used`);
}

export function loadPreset(preset: string) {
  return post<string>(`${ROOT}/${preset}/load`);
}
