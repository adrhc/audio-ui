import { List, ListItem } from '@mui/material';
import EmptyList from '../EmptyList';
import { NoArgsProc } from '../../domain/types';
import SongListTopNavigator from './SongListTopNavigator';
import SongListBottomNavigator from './SongListBottomNavigator';
import SongListItem from './SongListItem';
import { Song } from '../../domain/song';
import { TrackSong } from '../../domain/track-song';
import { AddAllSongsFn } from './navigator-commons';
import { ScrollToFn } from '../../domain/scroll';
import '/src/styles/list/list.scss';
import './SongList.scss';

type SongHandler = (song: Song) => void;
type SongsListParam = {
  prevSongsCount?: number;
  songs: Song[];
  currentSong?: TrackSong;
  onAdd?: SongHandler;
  onInsert?: SongHandler;
  onClick?: SongHandler;
  lastUsed?: Song | null;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
  listRef?: React.RefObject<HTMLUListElement>;
  pageBeforeExists?: boolean;
  pageAfterExists?: boolean;
  goToPreviousPage?: NoArgsProc;
  goToNextPage?: NoArgsProc;
  scrollTo?: ScrollToFn;
  onAddAllSongs?: AddAllSongsFn;
  onRealoadList?: NoArgsProc;
};

function SongList({
  prevSongsCount = 0,
  songs,
  currentSong,
  onAdd,
  onInsert,
  onClick,
  lastUsed,
  onScroll,
  listRef,
  pageBeforeExists,
  pageAfterExists,
  goToPreviousPage,
  goToNextPage,
  scrollTo,
  onRealoadList,
  onAddAllSongs,
}: SongsListParam) {
  // console.log(`[SongsList] lastUsed:`, lastUsed);

  /* const shouldAutoFocus = useCallback(
    (song: Song, index: number) => {
      const toAutoFocus = songEquals(song, currentSong) || isLastUsed(song) || index == 0;
      return toAutoFocus;
    },
    [currentSong, isLastUsed]
  ); */

  if (songs.length == 0) {
    return <EmptyList />;
  }

  return (
    <List className="list song-list" onScroll={onScroll} ref={listRef}>
      {(pageBeforeExists || songs.length || pageAfterExists) && (
        <ListItem key="SongListTopNavigator" className="MENU" disablePadding>
          <SongListTopNavigator
            songs={songs}
            listRef={listRef}
            pageBeforeExists={pageBeforeExists}
            pageAfterExists={pageAfterExists}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            scrollTo={scrollTo}
            onRealoadList={onRealoadList}
            onAddAllSongs={onAddAllSongs}
          />
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

      {(pageBeforeExists || songs.length || pageAfterExists) && (
        <ListItem key="SongListBottomNavigator" className="MENU" disablePadding>
          <SongListBottomNavigator
            songs={songs}
            pageBeforeExists={pageBeforeExists}
            pageAfterExists={pageAfterExists}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            scrollTo={scrollTo}
            onRealoadList={onRealoadList}
            onAddAllSongs={onAddAllSongs}
          />
        </ListItem>
      )}
    </List>
  );
}

export default SongList;
