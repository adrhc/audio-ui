import _ from 'lodash';
import { fillWithLastElem } from './array';

export function zipBreakpoints<T1, T2, TResult>(
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
