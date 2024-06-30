import { ScrollToFn } from '../../domain/scroll';
import { Song } from '../../domain/song';
import { NoArgsProc } from '../../domain/types';

export type AddAllSongsFn = (songs: Song[]) => void;

export interface SongListNavigatorParam {
  songs: Song[];
  listRef?: React.RefObject<HTMLUListElement>;
  scrollTo?: ScrollToFn;
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  onRealoadList?: NoArgsProc;
  onAddAllSongs?: AddAllSongsFn;
}

export function shouldShowTopNavigator(param: SongListNavigatorParam) {
  return shouldShowNavigator(param, true);
}

export function shouldShowNavigator(
  {
    songs,
    listRef,
    scrollTo,
    pageBeforeExists,
    pageAfterExists,
    goToPreviousPage,
    goToNextPage,
    onRealoadList,
    onAddAllSongs,
  }: SongListNavigatorParam,
  isTop?: boolean
) {
  return (
    (pageBeforeExists && goToPreviousPage) ||
    (scrollTo && (isTop ? listRef : true) && songs.length) ||
    (pageAfterExists && goToNextPage) ||
    onRealoadList ||
    onAddAllSongs
  );
}
