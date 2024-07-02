import { ScrollToFn } from './scroll';
import { Song } from './song';
import { NoArgsProc } from './types';

export type AddAllSongsFn = (songs: Song[]) => void;

export interface SongListItemMenuParam {
  songs: Song[];
  listRef?: React.RefObject<HTMLUListElement>;
  scrollTo?: ScrollToFn;
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  onAddAllSongs?: AddAllSongsFn;
  onRealoadList?: NoArgsProc;
  bottom?: boolean;
}

export function shouldShowListItemMenu({
  songs,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  onAddAllSongs,
  onRealoadList,
  ...scrollToParam
}: SongListItemMenuParam) {
  return (
    (pageBeforeExists && !!goToPreviousPage) ||
    showScrollTo({ songs, ...scrollToParam }) ||
    (pageAfterExists && !!goToNextPage) ||
    !!onRealoadList ||
    (!!onAddAllSongs && !!songs.length)
  );
}

export function showScrollTo({ songs, listRef, scrollTo, bottom }: SongListItemMenuParam) {
  return !!scrollTo && (bottom ? true : !!listRef) && !!songs.length;
}
