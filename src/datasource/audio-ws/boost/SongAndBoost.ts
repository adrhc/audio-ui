import { Track } from '../../../domain/track';
import { CurrentBoost } from './CurrentBoost';

export interface SongAndBoost {
  boost?: CurrentBoost;
  currentSong: Track;
}
