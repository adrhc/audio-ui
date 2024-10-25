import Mopidy from 'mopidy';
import { MOPIDY_DISCONNECTED_ERROR } from '../../../constants';
import { truncateVolume } from '../../../domain/utils';
import { PlayOptions } from '../types';

export function previous(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.previous();
}

export function next(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.next();
}

export function stop(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.stop();
}

export function pause(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.pause();
}

export function resume(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.resume();
}

export function play(mopidy?: Mopidy, tlid?: number) {
  return mopidy?.playback == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playback.play({ tlid });
}

export function getState(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.getState();
}

export function mute(mopidy: Mopidy | undefined, newMute: boolean) {
  return mopidy?.mixer == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.mixer.setMute({ mute: newMute }).then((success: boolean) => {
        if (!success) {
          return Promise.reject(new Error(`Couldn't mute!`));
        }
      });
}

export function getMute(mopidy?: Mopidy): Promise<boolean | null> {
  return mopidy?.mixer == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.mixer.getMute();
}

export function setVolume(mopidy: Mopidy | undefined, newVolume: number) {
  console.log(`[Mopidy:setVolume] newVolume = ${newVolume} (it'll be trunked to [0,100])`);
  newVolume = truncateVolume(newVolume);
  return mopidy?.mixer == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.mixer.setVolume({ volume: newVolume }).then((success: boolean) => {
        if (!success) {
          return Promise.reject(new Error(`Couldn't set the volume to ${newVolume}!`));
        }
      });
}

export function getVolume(mopidy?: Mopidy): Promise<number | null> {
  return mopidy?.mixer == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.mixer.getVolume();
}

export function getPlayOptions(mopidy?: Mopidy): Promise<PlayOptions> {
  return Promise.all([
    mopidy?.tracklist?.getConsume(),
    mopidy?.tracklist?.getRandom(),
    mopidy?.tracklist?.getRepeat(),
    mopidy?.tracklist?.getSingle(),
  ]).then(([consume, random, repeat, single]) => ({ consume, random, repeat, single }) as PlayOptions);
}

export function setConsume(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setConsume({ value });
}

export function setRandom(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setRandom({ value });
}

export function setRepeat(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setRepeat({ value });
}

export function setSingle(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setSingle({ value });
}
