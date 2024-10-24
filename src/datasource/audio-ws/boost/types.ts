import { title, Track } from '../../../domain/track';

export interface VolumeBoost {
  uri: string;
  title: string;
  boost: number;
}

export interface SongAndBoost {
  boost?: CurrentBoost;
  currentSong: Track;
}

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

export function toCurrentBoost(vb?: VolumeBoost | null) {
  return vb ? new CurrentBoost(vb.uri, vb.boost) : null;
}

export function toVolumeBoost(
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
