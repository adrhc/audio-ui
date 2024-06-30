import { ListItem, IconButton, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useCallback } from 'react';
import { TrackSong, songEquals } from '../../domain/track-song';
import { Song } from '../../domain/song';
import SongListItemAvatar from './SongListItemAvatar';

type SongHandler = (song: Song) => void;

type SongListItemParam = {
  prevSongsCount: number;
  lastUsed?: Song | null;
  currentSong?: TrackSong;
  song: Song;
  index: number;
  onAdd?: SongHandler;
  onInsert?: SongHandler;
  onClick?: SongHandler;
};

function SongListItem({
  prevSongsCount,
  lastUsed,
  currentSong,
  song,
  index,
  onAdd,
  onInsert,
  onClick,
}: SongListItemParam) {
  // console.log(`[SongListItem]`, { song, lastUsed });
  const isLastUsed = useCallback(
    (song: Song) => {
      return song.uri == lastUsed?.uri;
    },
    [lastUsed]
  );

  const songCount = 1 + prevSongsCount + index;
  const showActions = onInsert || onAdd;
  return (
    <ListItem
      disablePadding
      className={`${song.type ?? ''} ${isLastUsed(song) ? 'last-used-song' : ''}`}
      // https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
      // JSX elements directly inside a map() call always need keys!
      // adrhc: hence the key must be used on the component (i.e. SongListItem)!
      // https://react.dev/learn/rendering-lists#why-does-react-need-keys
      // Note that your components won’t receive key as a prop. It’s only used as a hint by React itself.
      //
      // Using songCount because a song could be twice in the list!
      // key={`${songCount}/${song.uri}`}
      secondaryAction={
        showActions && (
          <Stack className="action">
            {onInsert && (
              <IconButton className="add-btn" onClick={() => onInsert(song)}>
                <img src="btn/four-arrows-inside-line-icon.svg" />
              </IconButton>
            )}
            {onAdd && (
              <IconButton className="insert-btn" onClick={() => onAdd(song)}>
                <img src="btn/plus-square-line-icon.svg" />
              </IconButton>
            )}
          </Stack>
        )
      }
    >
      {onClick && (
        <ListItemButton selected={songEquals(song, currentSong)} onClick={() => onClick(song)}>
          <SongListItemAvatar song={song} />
          <ListItemText primary={`${songCount}. ${song.title}`} secondary={song.formattedUri} />
        </ListItemButton>
      )}
    </ListItem>
  );
}

export default SongListItem;
