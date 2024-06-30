import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { NoArgsProc } from '../../domain/types';
import { Song } from '../../domain/song';
import { AddAllSongsFn } from './navigator-commons';
import { ScrollToFn } from '../../domain/scroll';

type SongListBottomNavigatorParam = {
  songs: Song[];
  pageBeforeExists?: boolean | null;
  pageAfterExists?: boolean | null;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  scrollTo?: ScrollToFn;
  onRealoadList?: NoArgsProc;
  onAddAllSongs?: AddAllSongsFn;
};

function SongListBottomNavigator({
  songs,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  scrollTo,
  onRealoadList,
  onAddAllSongs,
}: SongListBottomNavigatorParam) {
  return (
    <ButtonGroup>
      {pageBeforeExists && (
        <Button variant="outlined" onClick={goToPreviousPage}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      )}
      {scrollTo && songs.length && (
        <Button variant="outlined" onClick={() => scrollTo()}>
          <VerticalAlignTopOutlinedIcon />
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

export default SongListBottomNavigator;
