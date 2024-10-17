import { ThinSongListState } from '../../domain/song';
import { ScrollPosition } from '../../hooks/scrollable/useCachedPositionScrollable';

export interface SongSearchResult extends ThinSongListState {
  draftExpression?: string | null;
}

export interface SongSearchCache extends ScrollPosition, SongSearchResult {
  searchExpression: string;
}
