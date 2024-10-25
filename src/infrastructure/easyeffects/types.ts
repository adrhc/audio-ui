import _ from 'lodash';

export interface EEPresets {
  input: string[];
  output: string[];
}

export interface EEPreset {
  name: string;
  amount: number;
  blend: number;
  harmonics: number;
  floor: number;
  scope: number;
}

export function areEqual(source: EEPreset, updated: EEPreset) {
  // console.log(`[areEqual] source:`, source);
  // console.log(`[areEqual] updated:`, updated);
  return _.isMatchWith(source, updated, (_value, _other, key) =>
    key == 'loading' || key == 'error' ? true : undefined
  );
}

export function isPositiveFloor(preset: EEPreset) {
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
