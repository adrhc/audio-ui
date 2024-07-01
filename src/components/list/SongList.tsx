import { ListItem } from '@mui/material';
import SongListTopNavigator from './SongListTopNavigator.tsx';
import SongListBottomNavigator from './SongListBottomNavigator.tsx';
import SongListItem from './SongListItem';
import { Song } from '../../domain/song';
import { TrackSong } from '../../domain/track-song';
import { SongListNavigatorParam, shouldShowNavigator, shouldShowTopNavigator } from './navigator-commons';
import { LoadingState } from '../../lib/sustain.ts';
import LoadingList from './LoadingList.tsx';
import '/src/styles/list/list.scss';
import './SongList.scss';

type SongHandler = (song: Song) => void;

interface SongsListParam extends SongListNavigatorParam {
  prevSongsCount?: number;
  currentSong?: TrackSong;
  onAdd?: SongHandler;
  onInsert?: SongHandler;
  onClick?: SongHandler;
  lastUsed?: Song | null;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
}

function SongList({
  prevSongsCount = 0,
  songs,
  loading,
  currentSong,
  onAdd,
  onInsert,
  onClick,
  lastUsed,
  listRef,
  onScroll,
  ...partialNavParam
}: LoadingState<SongsListParam>) {
  // console.log(`[SongsList] lastUsed:`, lastUsed);

  const navParam = { songs, listRef, ...partialNavParam };
  const showTopNav = shouldShowTopNavigator(navParam);
  const showBottomNav = shouldShowNavigator(navParam) && !!songs.length;

  return (
    <LoadingList
      className="list song-list"
      onScroll={onScroll}
      listRef={listRef}
      loading={loading}
      length={songs.length}
      empty={!showTopNav && !showBottomNav && !songs.length}
    >
      {showTopNav && (
        <ListItem key="SongListTopNavigator" className="MENU" disablePadding>
          <SongListTopNavigator {...navParam} />
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
          currentSong={currentSong}
          onAdd={onAdd}
          onInsert={onInsert}
          onClick={onClick}
        />
      ))}

      {showBottomNav && (
        <ListItem key="SongListBottomNavigator" className="MENU" disablePadding>
          <SongListBottomNavigator {...navParam} />
        </ListItem>
      )}
    </LoadingList>
  );
}

export default SongList;
