import { AddManySongsFn } from '../../hooks/usePlayingList';
import { ListRef, ScrollToFn } from '../../domain/scroll';
import { Song } from '../../domain/song';
import { NoArgsProc } from '../../domain/types';

export interface SongListItemMenuParam {
  songs: Song[];
  listRef?: ListRef;
  scrollTo?: ScrollToFn;
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  addManySongs?: AddManySongsFn;
  onReloadList?: NoArgsProc;
  bottom?: boolean;
}

export function shouldShowListItemMenu({
  songs,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  addManySongs,
  onReloadList,
  ...scrollToParam
}: SongListItemMenuParam) {
  return (
    (pageBeforeExists && !!goToPreviousPage) ||
    showScrollTo({ songs, ...scrollToParam }) ||
    (pageAfterExists && !!goToNextPage) ||
    !!onReloadList ||
    (!!addManySongs && !!songs.length)
  );
}

export function showScrollTo({ songs, listRef, scrollTo, bottom }: SongListItemMenuParam) {
  return !!scrollTo && (bottom ? true : !!listRef) && !!songs.length;
}
