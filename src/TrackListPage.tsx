import { useContext, useEffect, useState } from 'react';
import { AppContext } from './App';
import { SongAndArtists, collectSongAndArtists, collectTrackList, play } from './lib/mpc';
import { List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TrackListPage = () => {
  const { online, mopidyRef } = useContext(AppContext);
  const [songs, setSongs] = useState<SongAndArtists[]>([]);
  const [currentSong, setCurrentSong] = useState<SongAndArtists>({});
  console.log(
    `[TrackListPage] mopidyRef = ${!!mopidyRef.current}, online = ${online} songs = ${songs.length}`
  );
  const navigate = useNavigate();

  useEffect(() => {
    const mopidy = mopidyRef.current;
    console.log(`[TrackListPage:useEffect] mopidy = ${!!mopidy}, online = ${online}`);
    if (!online) {
      return;
    }
    collectTrackList(setSongs, mopidy);
    collectSongAndArtists(setCurrentSong, mopidy);
  }, [mopidyRef.current, online]);

  function handleSelection(sa: SongAndArtists) {
    console.log(`[TrackListPage:handleSelection] song = ${sa.song}, artists = ${sa.artists}`);
    play(mopidyRef.current, sa.tlid, () => navigate(-1));
  }

  return (
    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
      <List sx={{ p: 0, overflow: 'auto', maxHeight: '100%' }}>
        {songs
          .filter((sa) => !!sa.song)
          .map((sa, i) => (
            <ListItem key={i} disablePadding disableGutters sx={{ border: 'solid thin rgba(0, 0, 0, 0.2)' }}>
              <ListItemButton
                selected={sa.tlid == currentSong?.tlid}
                sx={{ px: 0.5, py: 0 }}
                onClick={() => handleSelection(sa)}
              >
                <ListItemText
                  sx={{ wordBreak: 'break-all' }}
                  primary={sa.song}
                  primaryTypographyProps={{ letterSpacing: 0, lineHeight: sa.artists ? 1.5 : 1 }}
                  secondary={sa.artists}
                  secondaryTypographyProps={{ letterSpacing: 0, lineHeight: 1 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Stack>
  );
};

export default TrackListPage;
