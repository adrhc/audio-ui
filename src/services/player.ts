import Mopidy from 'mopidy';
import { setPower } from './kef';
import { play as playMopidy, resume as resumeMopidy } from './mpc';
import { isAdrhc } from '../lib/adrhc';

export function resume(mopidy?: Mopidy) {
  isAdrhc() && setPower(true);
  return resumeMopidy(mopidy);
}

export function play(mopidy: Mopidy | undefined, tlid?: number) {
  isAdrhc() && setPower(true);
  return playMopidy(mopidy, tlid);
}
