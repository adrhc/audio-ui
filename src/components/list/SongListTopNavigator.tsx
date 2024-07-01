import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { SongListNavigatorParam } from './navigator-commons';

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
}: SongListNavigatorParam) {
  return (
    <ButtonGroup>
      {pageBeforeExists && goToPreviousPage && (
        <Button variant="outlined" onClick={goToPreviousPage}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      )}
      {scrollTo && listRef && songs.length && (
        <Button variant="outlined" onClick={() => scrollTo(listRef?.current?.scrollHeight)}>
          <VerticalAlignBottomOutlinedIcon />
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

export default SongListTopNavigator;
