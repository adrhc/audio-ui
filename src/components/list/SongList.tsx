import { ListItem, ListItemText } from '@mui/material';
import SongListItemMenu from './SongListItemMenu.tsx';
import SongListItem from './SongListItem';
import { SelectableSong, Song } from '../../domain/song';
import { SongListItemMenuParam, shouldShowListItemMenu } from './SongListItemMenuParam';
import { LoadingState } from '../../lib/sustain/types';
import LoadingList from './LoadingList.tsx';
import ScrollableList from '../../domain/scroll';
import './SongList.scss';

type SongHandler = (song: Song) => void;

interface SongsListParam extends ScrollableList, SongListItemMenuParam {
  prevSongsCount?: number;
  onAdd?: SongHandler;
  onInsert?: SongHandler;
  onDelete?: SongHandler;
  onClick?: SongHandler;
  onSelect?: (song: SelectableSong) => void;
  lastUsed?: Song | null;
  className?: string;
}

function SongList({
  prevSongsCount = 0,
  songs,
  loading,
  onAdd,
  onInsert,
  onDelete,
  onClick,
  onSelect,
  lastUsed,
  listRef,
  onScroll,
  className,
  ...partialNavParam
}: LoadingState<SongsListParam>) {
  // console.log(`[SongsList] lastUsed:`, lastUsed);

  const navParam = { songs, listRef, ...partialNavParam };
  const showListItemMenu = shouldShowListItemMenu(navParam);

  return (
    <LoadingList
      className={`${className} song-list`}
      onScroll={onScroll}
      listRef={listRef}
      loading={loading}
      length={songs.length}
      empty={!showListItemMenu && !songs.length}
    >
      {showListItemMenu && (
        <ListItem key="SongListItemTopMenu" className="MENU" disablePadding>
          <SongListItemMenu {...navParam} />
        </ListItem>
      )}

      {songs.map((song, index) => (
        // https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
        // JSX elements directly inside a map() call always need keys!
        // adrhc: hence the key must be used on the component (i.e. SongListItem)!
        <SongListItem
          // https://react.dev/learn/rendering-lists#why-does-react-need-keys
          // Note that your components won’t receive key as a prop. It’s only used as a hint by React itself.
          // Using songCount because a song could be twice in the list!
          key={`${1 + prevSongsCount + index}/${song.uri}`}
          song={song}
          index={index}
          prevSongsCount={prevSongsCount}
          lastUsed={lastUsed}
          onAdd={onAdd}
          onInsert={onInsert}
          onDelete={onDelete}
          onClick={onClick}
          onSelect={onSelect}
        />
      ))}

      {showListItemMenu && !songs.length && (
        <ListItem key="empty" className="empty">
          <ListItemText primary="The list is empty!" />
        </ListItem>
      )}

      {showListItemMenu && !!songs.length && (
        <ListItem key="SongListItemBottomMenu" className="MENU" disablePadding>
          <SongListItemMenu {...navParam} bottom={true} />
        </ListItem>
      )}
    </LoadingList>
  );
}

export default SongList;
