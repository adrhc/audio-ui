import { ListItem, IconButton, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useCallback, useContext } from 'react';
import { songEqual } from '../../domain/track';
import { SelectableSong, Song } from '../../domain/song';
import SongListItemAvatar from './SongListItemAvatar';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { AppContext } from '../../hooks/AppContext';

type SongHandler = (song: Song) => void;

type SongListItemParam = {
  prevSongsCount: number;
  lastUsed?: Song | null;
  song: SelectableSong;
  index: number;
  onAdd?: SongHandler;
  onInsert?: SongHandler;
  onDelete?: SongHandler;
  onDownload?: SongHandler;
  onClick?: SongHandler;
  onSelect?: (song: SelectableSong) => void;
};

function SongListItem({
  prevSongsCount,
  lastUsed,
  song,
  index,
  onAdd,
  onInsert,
  onDelete,
  onDownload,
  onClick,
  onSelect,
}: SongListItemParam) {
  // console.log(`[SongListItem]`, { song, lastUsed });
  const { currentSong } = useContext(AppContext);
  const isLastUsed = useCallback(
    (song: Song) => {
      return song.uri == lastUsed?.uri;
    },
    [lastUsed]
  );

  const songCount = 1 + prevSongsCount + index;
  const showSelectAction = !!(song.selected && onSelect);
  const showLeftColumn = !!onDelete || showSelectAction || !!onDownload;
  const showRightColumn = !!onInsert || !!onAdd;
  const showActions = showLeftColumn || showRightColumn;
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
          <Stack className="action" direction="row">
            {showLeftColumn && (
              <Stack className="action-column action-column-left">
                {onDelete && (
                  <IconButton className="del-btn" onClick={() => onDelete(song)}>
                    <img src="btn/recycle-bin-line-icon.svg" />
                  </IconButton>
                )}
                {showSelectAction && (
                  // <CheckBoxOutlinedIcon className="secondary-action-btn" onClick={() => onSelect(song)} />
                  <IconButton className="select-btn" onClick={() => onSelect(song)}>
                    <CheckBoxOutlinedIcon />
                  </IconButton>
                )}
                {onDownload && (
                  <IconButton className="download-btn" onClick={() => onDownload(song)}>
                    <img src="btn/download-file-square-line-icon.svg" />
                  </IconButton>
                )}
              </Stack>
            )}
            {showRightColumn && (
              <Stack className="action-column action-column-right">
                {onAdd && (
                  <IconButton className="insert-btn" onClick={() => onAdd(song)}>
                    <img src="btn/plus-square-line-icon.svg" />
                  </IconButton>
                )}
                {onInsert && (
                  <IconButton className="add-btn" onClick={() => onInsert(song)}>
                    <img src="btn/four-arrows-inside-line-icon.svg" />
                  </IconButton>
                )}
              </Stack>
            )}
          </Stack>
        )
      }
    >
      <ListItemButton selected={songEqual(song, currentSong)} onClick={() => (onClick ?? onSelect)?.(song)}>
        <SongListItemAvatar song={song} />
        <ListItemText primary={`${songCount}. ${song.title}`} secondary={song.formattedUri} />
      </ListItemButton>
    </ListItem>
  );
}

export default SongListItem;
