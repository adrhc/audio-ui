import { useContext, useEffect, useState } from 'react';
import { AppContext } from './App';
import { SongAndArtists, getSongAndArtists, getTrackList, play } from './lib/mpc';
import { Button, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatErr } from './lib/logging';

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
      .catch((reason) => alert(formatErr(reason)));
  }, [mopidy, online]);

  function handleSelection(song: SongAndArtists) {
    // console.log(`[TrackListPage:handleSelection] song:\n`, song);
    play(mopidy, song.tlid)?.catch((reason) => alert(formatErr(reason)));
  }

  return (
    <Stack
      spacing={1}
      sx={{
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <List
        sx={{
          p: 0,
          overflow: 'auto',
          maxHeight: '100%',
          border: 'thin solid rgba(0, 0, 0, 0.2)',
          borderLeft: 'none',
        }}
      >
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
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Back
      </Button>
    </Stack>
  );
};

export default TrackListPage;
