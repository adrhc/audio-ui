import Mopidy from 'mopidy';
import { get, postVoid } from './rest';
import { getCurrentTrack } from './tracks-load';
import { Track, title } from '../domain/track';

const ROOT = '/audio-ui/api';

export class CurrentBoost {
  constructor(
    public uri: string,
    public boost: number
  ) {}

  public hasUri(uri?: string | null) {
    return this.uri == uri;
  }

  public baseVolume(volume?: number | null) {
    return (volume ?? 0) - this.boost;
  }
}

export type VolumeBoost = { uri: string; title: string; boost: number };
export type SongAndBoost = { boost?: CurrentBoost; currentSong: Track };

export function toCurrentBoost(vb?: VolumeBoost | null) {
  return vb ? new CurrentBoost(vb.uri, vb.boost) : null;
}

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
  return get<VolumeBoost | null>(`${ROOT}/volume-boost?${params.toString()}`);
}

export function boostVolume(volumeBoost: VolumeBoost) {
  return postVoid(`${ROOT}/volume-boost`, JSON.stringify(volumeBoost));
}

export function volumeBoost(
  baseVolume: number | null | undefined,
  volume: number | null | undefined,
  songAndArtists: Track | null | undefined
) {
  if (baseVolume == null || volume == null || songAndArtists?.uri == null) {
    return null;
  } else {
    return {
      uri: songAndArtists?.uri,
      title: title(songAndArtists),
      boost: volume - baseVolume,
    } as VolumeBoost;
  }
}
