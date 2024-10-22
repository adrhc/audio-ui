import { VolumeBoost } from './VolumeBoost';

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
