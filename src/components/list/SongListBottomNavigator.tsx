import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { SongListNavigatorParam } from './navigator-commons';

function SongListBottomNavigator({
  songs,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  scrollTo,
  onRealoadList,
  onAddAllSongs,
}: SongListNavigatorParam) {
  return (
    <ButtonGroup>
      {pageBeforeExists && goToPreviousPage && (
        <Button variant="outlined" onClick={goToPreviousPage}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      )}
      {scrollTo && songs.length && (
        <Button variant="outlined" onClick={() => scrollTo()}>
          <VerticalAlignTopOutlinedIcon />
        </Button>
      )}
      {pageAfterExists && goToNextPage && (
        <Button variant="outlined" onClick={goToNextPage}>
          <ArrowForwardIosOutlinedIcon />
        </Button>
      )}
      {onRealoadList && (
        <Button variant="outlined" onClick={onRealoadList}>
          <CachedOutlinedIcon />
        </Button>
      )}
      {onAddAllSongs && songs.length && (
        <Button variant="outlined" onClick={() => onAddAllSongs(songs)}>
          <AddBoxOutlinedIcon />
        </Button>
      )}
    </ButtonGroup>
  );
}

export default SongListBottomNavigator;
