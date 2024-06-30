import _ from 'lodash';

export function fillWithLastElem<T>(arr: T[], length: number) {
  const last = arr[arr.length - 1];
  const newArr = [...arr];
  for (let i = arr.length; i < length; i++) {
    newArr.push(last);
  }
  return newArr;
}

export function valueAtIndexOrLast<T>(arr: T[], index: number): T {
  return arr.length <= index ? arr[arr.length - 1] : arr[index];
}

export function toArray<T>(t: T) {
  return Array.isArray(t) ? t : [t];
}

/**
 * Example:
 *
 * arr1 = {a, b, c}
 * arr1 = {u, v, w, x, y, z}
 *
 * arr1 is changed to:
 * arr1 = {a, b, c, c, c, c}
 *
 * @returns _.zipWith(arr1, arr2, iteratee)
 */
export function zipDiffSizesWith<T1, T2, TResult>(
  arr1: T1[],
  arr2: T2[],
  iteratee: (value1: T1, value2: T2) => TResult
) {
  if (arr1.length > arr2.length) {
    arr2 = fillWithLastElem(arr2, arr1.length);
  } else {
    arr1 = fillWithLastElem(arr1, arr2.length);
  }
  return _.zipWith(arr1, arr2, iteratee);
}

export function nvl<T>(...args: T[]) {
  return args.find((arg) => !_.isEmpty(arg)) as T;
}
