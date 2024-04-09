import { useContext, useEffect, useState } from 'react';
import { AppContext } from './App';
import { SongAndArtists, getSongAndArtists, getTrackList, play } from './lib/mpc';
import { List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type TrackListPageState = {
  songs: SongAndArtists[];
  current: SongAndArtists;
};

const TrackListPage = () => {
  const { mopidy, online } = useContext(AppContext);
  const [state, setState] = useState<TrackListPageState>({ songs: [], current: {} });
  console.log(`[TrackListPage] online = ${online}, state:\n`, state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!online) {
      return;
    }
    // console.log(`[TrackListPage:useEffect]`);
    Promise.all([getSongAndArtists(mopidy), getTrackList(mopidy)])
      .then(([current, songs]) => {
        console.log(`[TrackListPage:useEffect] ${songs?.length} songs, current:\n`, current);
        setState((previous) => ({ current: current ?? previous.current, songs: songs ?? previous.songs }));
      })
      .catch((reason) => {
        alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
      });
  }, [mopidy, online]);

  function handleSelection(song: SongAndArtists) {
    console.log(`[TrackListPage:handleSelection] song:\n`, song);
    play(mopidy, song.tlid, () => navigate(-1));
  }

  return (
    <Stack
      sx={{
        height: '100%',
        justifyContent: 'center',
        border: 'thin solid rgba(0, 0, 0, 0.2)',
        borderLeft: 'none',
      }}
    >
      <List sx={{ p: 0, overflow: 'auto', maxHeight: '100%' }}>
        {state.songs
          .filter((sa) => !!sa.song)
          .map((sa, i) => (
            <ListItemButton
              key={i}
              selected={sa.tlid == state.current.tlid}
              sx={{ px: 0.5, py: [1, 0.25], border: 'solid thin rgba(0, 0, 0, 0.2)' }}
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
          ))}
      </List>
    </Stack>
  );
};

export default TrackListPage;
