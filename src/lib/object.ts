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

export function omitProps<T, P extends keyof T>(o: T, prop: P | P[]) {
  if (_.isArray(prop)) {
    for (const k of prop) {
      delete o[k];
    }
  } else {
    delete o[prop];
  }
  return o;
}
