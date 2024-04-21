import Mopidy from 'mopidy';
import { setPower } from './kef';
import { play } from './mpc';
import { isAdrhc } from '../lib/adrhc';
import { formatErr } from '../lib/format';

export function playCurrent(mopidy: Mopidy) {
  isAdrhc() && setPower(true);
  return play(mopidy);
}

export function safelyPlayCurrent(mopidy: Mopidy) {
  isAdrhc() && setPower(true);
  return play(mopidy)?.catch((reason) => alert(formatErr(reason)));
}

export function playSelection(mopidy: Mopidy, tlid: number) {
  isAdrhc() && setPower(true);
  return play(mopidy, tlid);
}
