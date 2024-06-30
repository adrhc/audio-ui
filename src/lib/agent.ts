import { mobileModel } from 'react-device-detect';

export function ifIPhone<T>(value: T, otherwise?: T) {
  return mobileModel == 'iPhone' ? value : otherwise;
}

export function isIPhone() {
  return mobileModel == 'iPhone';
}
