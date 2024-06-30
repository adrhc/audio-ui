import { ScrollToFn } from '../../domain/scroll';
import { Song } from '../../domain/song';
import { NoArgsProc } from '../../domain/types';
import { AddAllSongsFn } from './navigator-commons';

export type SongListTopNavigatorParam = {
  songs: Song[];
  listRef?: React.RefObject<HTMLUListElement>;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  scrollTo?: ScrollToFn;
  onRealoadList?: NoArgsProc;
  onAddAllSongs?: AddAllSongsFn;
};

export function shouldShowTopNavigator(param: Partial<SongListTopNavigatorParam>) {
  return (
    param.pageBeforeExists ||
    (param.scrollTo && param.songs?.length) ||
    param.pageAfterExists ||
    param.onRealoadList ||
    param.onAddAllSongs
  );
}
