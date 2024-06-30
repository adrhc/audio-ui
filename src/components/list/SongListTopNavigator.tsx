import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { NoArgsProc } from '../../domain/types';
import { Song } from '../../domain/song';
import { AddAllSongsFn } from './navigator-commons';
import { ScrollToFn } from '../../domain/scroll';

type SongListTopNavigatorParam = {
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

function SongListTopNavigator({
  songs,
  listRef,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  scrollTo,
  onRealoadList,
  onAddAllSongs,
}: SongListTopNavigatorParam) {
  return (
    <ButtonGroup>
      {pageBeforeExists && (
        <Button variant="outlined" onClick={goToPreviousPage}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      )}
      {scrollTo && songs.length && (
        <Button variant="outlined" onClick={() => scrollTo(listRef?.current?.scrollHeight)}>
          <VerticalAlignBottomOutlinedIcon />
        </Button>
      )}
      {pageAfterExists && (
        <Button variant="outlined" onClick={goToNextPage}>
          <ArrowForwardIosOutlinedIcon />
        </Button>
      )}
      {onRealoadList && (
        <Button variant="outlined" onClick={onRealoadList}>
          <CachedOutlinedIcon />
        </Button>
      )}
      {onAddAllSongs && (
        <Button variant="outlined" onClick={() => onAddAllSongs(songs)}>
          <AddBoxOutlinedIcon />
        </Button>
      )}
    </ButtonGroup>
  );
}

export default SongListTopNavigator;
