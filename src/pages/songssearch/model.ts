import { ThinSongListState } from '../../domain/song';
import { ScrollPosition } from '../../hooks/scrollable/useCachedPositionScrollable';

export interface RawSongsSearchPageState extends ThinSongListState {
  draftExpression?: string | null;
}

export interface SongSearchCache extends ScrollPosition, RawSongsSearchPageState {
  searchExpression: string;
}
