import { title, Track } from '../../../domain/track';

export interface VolumeBoost {
  uri: string;
  title: string;
  boost: number;
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
