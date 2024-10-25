import { get, post, removeVoid } from '../../lib/rest';
import { EEPreset, EEPresets } from './types';

const ROOT = '/easyeffects/api/ee';

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
