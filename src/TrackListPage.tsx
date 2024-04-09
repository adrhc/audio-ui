import { useContext, useEffect, useState } from 'react';
import { AppContext } from './App';
import { SongAndArtists, getSongAndArtists, getTrackList, play, toSongAndArtists } from './lib/mpc';
import { Button, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatErr } from './lib/logging';
import { CoreListenerEvent, MopidyEvent } from './lib/types';
import Mopidy, { models } from 'mopidy';

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
    console.log(`[TrackListPage:mopidy]`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push([
      'event:trackPlaybackStarted' as CoreListenerEvent,
      (params: { tl_track: models.TlTrack }) => {
        console.log(`[TrackListPage:trackPlaybackStarted]`);
        // console.log(`[TrackListPage:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
        // logTlTrack(params.tl_track);
        setState((old) => ({ ...old, current: toSongAndArtists(params.tl_track) }));
      },
    ]);

    events.push([
      'event:volumeChanged' as CoreListenerEvent,
      ({ volume }: { volume: number }) => {
        // console.log(`[TrackListPage:volumeChanged] volume = ${volume}`);
        console.log(`[TrackListPage:volumeChanged] volume = ${volume}`);
        getSongAndArtists(mopidy)?.then((current) => {
          console.log(`[TrackListPage:volumeChanged] newSongAndArtists:\n`, current);
          setState((old) => ({ ...old, current }));
        });
      },
    ]);

    events.forEach((e) => mopidy.on(...e));

    return () => {
      console.log(`[TrackListPage:destroy]`);
      events.forEach((e) => mopidy.off(...e));
    };
  }, [mopidy]);

  useEffect(() => {
    if (!online) {
      return;
    }
    // console.log(`[TrackListPage:online]`);
    Promise.all([getSongAndArtists(mopidy), getTrackList(mopidy)])
      .then(([current, songs]) => {
        console.log(`[TrackListPage:online] ${songs?.length} songs, current:\n`, current);
        setState((old) => ({ current: current ?? old.current, songs: songs ?? old.songs }));
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
        pb: [1, 0],
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
