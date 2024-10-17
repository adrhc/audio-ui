import { ButtonGroup, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { SongListItemMenuParam, showAddMany, showScrollTo } from './SongListItemMenuParam';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

function SongListItemMenu({
  songs,
  listRef,
  scrollTo,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  onReloadList: onRealoadList,
  addManySongs,
  addManyDisabled,
  onMinus,
  onPlus,
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
      {showAddMany({ songs, addManySongs, addManyDisabled }) && (
        <Button variant="outlined" onClick={() => addManySongs!(songs)}>
          <AddBoxOutlinedIcon />
        </Button>
      )}
      {onMinus && songs.length && (
        <Button variant="outlined" onClick={onMinus}>
          <CheckBoxOutlineBlankOutlinedIcon />
        </Button>
      )}
      {onPlus && songs.length && (
        <Button variant="outlined" onClick={onPlus}>
          <CheckBoxOutlinedIcon />
        </Button>
      )}
    </ButtonGroup>
  );
}

export default SongListItemMenu;
