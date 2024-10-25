import _ from 'lodash';

/**
 * @returns obj without null or undefined properties
 */
export function removeEmptyProps<T>(obj: T): Partial<T> {
  /* return Object.fromEntries(
    Object.entries(obj as { [s: string]: unknown }).filter(([, v]) => v != undefined)
  ); */
  let kt: keyof T;
  for (kt in obj) {
    if (obj[kt] == null) {
      delete obj[kt];
    }
  }
  return obj;
}

export function removeProps<T, P extends keyof T>(obj: T, prop: P | P[]) {
  if (_.isArray(prop)) {
    for (const k of prop) {
      delete obj[k];
    }
  } else {
    delete obj[prop];
  }
  return obj;
}
