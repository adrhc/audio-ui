import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { SongListItemMenuParam, showScrollTo } from '../../domain/SongListItemMenuParam';

function SongListItemMenu({
  songs,
  listRef,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  scrollTo,
  onReloadList: onRealoadList,
  onAddAllSongs,
  bottom,
}: SongListItemMenuParam) {
  return (
    <ButtonGroup>
      {pageBeforeExists && goToPreviousPage && (
        <Button variant="outlined" onClick={goToPreviousPage}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      )}
      {showScrollTo({ songs, listRef, scrollTo, bottom }) && (
        <Button variant="outlined" onClick={() => scrollTo!(bottom ? 0 : listRef?.current?.scrollHeight)}>
          {!bottom && <VerticalAlignBottomOutlinedIcon />}
          {bottom && <VerticalAlignTopOutlinedIcon />}
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

export default SongListItemMenu;
