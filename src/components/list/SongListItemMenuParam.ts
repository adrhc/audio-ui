import { AddManySongsFn } from '../../hooks/usePlayingList';
import { ListRef, ScrollToFn } from '../../domain/scroll';
import { SelectableSong } from '../../domain/song';
import { NoArgsProc } from '../../domain/types';

export interface SongListItemMenuParam {
  songs: SelectableSong[];
  listRef?: ListRef;
  scrollTo?: ScrollToFn;
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  addManySongs?: AddManySongsFn;
  onReloadList?: NoArgsProc;
  onMinus?: NoArgsProc;
  onPlus?: NoArgsProc;
  addManyDisabled?: boolean;
  bottom?: boolean;
}

export function shouldShowListItemMenu({
  songs,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  onReloadList,
  onMinus,
  onPlus,
  ...scrollToParam
}: SongListItemMenuParam) {
  return (
    (pageBeforeExists && goToPreviousPage) ||
    showScrollTo({ songs, ...scrollToParam }) ||
    (pageAfterExists && goToNextPage) ||
    onReloadList ||
    showAddMany({ songs, ...scrollToParam }) ||
    ((onMinus || onPlus) && songs.length)
  );
}

export function showAddMany({ addManyDisabled, addManySongs, songs }: SongListItemMenuParam) {
  return !addManyDisabled && addManySongs && songs.length;
}

export function showScrollTo({ songs, listRef, scrollTo, bottom }: SongListItemMenuParam) {
  return scrollTo && (bottom || listRef) && songs.length;
}
