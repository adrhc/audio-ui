import { ListItemText } from '@mui/material';
import { TrackSong } from '../../domain/track-song';

function TrackListItemText({ track, index }: { track: TrackSong; index: number }) {
  const primary = `${index}. ${track.title}`;
  // console.log(`primary: ${primary}\nartists: ${value.artists}\nformattedUri: ${track.formattedUri}`);
  if (track.artists) {
    if (track.formattedUri && track.formattedUri != track.title) {
      return (
        <ListItemText
          primary={primary}
          secondary={
            <>
              {track.artists}
              <br />
              {track.formattedUri}
            </>
          }
        />
      );
    } else {
      return <ListItemText primary={primary} secondary={track.artists} />;
    }
  } else {
    if (track.formattedUri && track.formattedUri != track.title) {
      return <ListItemText primary={primary} secondary={track.formattedUri} />;
    } else {
      return <ListItemText primary={primary} />;
    }
  }
}

export default TrackListItemText;
