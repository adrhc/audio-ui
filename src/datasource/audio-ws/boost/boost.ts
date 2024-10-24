import Mopidy from 'mopidy';
import { get, postVoid } from '../../../services/rest';
import { getCurrentTrack } from '../../../services/tracks-load';
import { SongAndBoost, VolumeBoost, CurrentBoost } from './types';

const VOLUME_BOOST = '/audio-ui/api/volume-boost';

export function getSongAndBoost(mopidy?: Mopidy) {
  return getCurrentTrack(mopidy)?.then((currentSong) => {
    if (currentSong?.uri) {
      return getVolumeBoost(currentSong.uri).then((volumeBoost) => {
        const boost = volumeBoost ? new CurrentBoost(volumeBoost.uri, volumeBoost.boost) : undefined;
        return { boost, currentSong } as SongAndBoost;
      });
    } else {
      return { currentSong } as SongAndBoost;
    }
  });
}

export function getVolumeBoost(uri: string) {
  const params = new URLSearchParams();
  params.set('uri', uri);
  return get<VolumeBoost | null>(`${VOLUME_BOOST}?${params.toString()}`);
}

export function boostVolume(volumeBoost: VolumeBoost) {
  return postVoid(`${VOLUME_BOOST}`, JSON.stringify(volumeBoost));
}
