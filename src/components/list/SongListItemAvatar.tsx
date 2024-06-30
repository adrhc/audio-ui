import { ListItemAvatar } from '@mui/material';
import { Song } from '../../domain/song';

function SongListItemAvatar({ song }: { song: Song }) {
  if (song.imgUri) {
    return (
      <ListItemAvatar>
        <img src={song.imgUri} />
      </ListItemAvatar>
    );
  }
}

export default SongListItemAvatar;
