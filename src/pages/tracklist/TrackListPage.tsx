import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import { SongAndArtists, getSongAndArtists, getTrackList, toSongAndArtists } from '../../services/mpc';
import {
  Button,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Stack,
  useTheme,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatErr } from '../../lib/format';
import { CoreListenerEvent, MopidyEvent } from '../../lib/types';
import Mopidy, { models } from 'mopidy';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';
import Spinner from '../../components/Spinner';
import ShowIf from '../../components/ShowIf';
import { useEmptyHistory } from '../../hooks/useEmptyHistory';
import * as agent from 'react-device-detect';
import { ifIPhone } from '../../lib/agent';
import { getUA, isTablet } from 'react-device-detect';
import { SHOW_LOGS } from '../../constants';
import Logs from '../../components/Logs';
import { playSelection } from '../../services/player';
import pageStyles from '../page.module.scss';
import styles from './styles.module.scss';

type TrackListPageState = {
  songs: SongAndArtists[];
  current: SongAndArtists;
  loading?: boolean;
};

export default function TrackListPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const emptyHistory = useEmptyHistory();
  const { mopidy, online } = useContext(AppContext);
  const [state, setState] = useState<TrackListPageState>({ loading: true, songs: [], current: {} });
  console.log(`[TrackListPage] online = ${online}, emptyHistory = ${emptyHistory}, state:\n`, state);
  const theme = useTheme();
  const navigate = useNavigate();
  const wantedImgHeight = theme.spacing(6);

  function addLog(log: string) {
    (SHOW_LOGS || false) && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    addLog(getUA);
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
        setState((old) => ({ ...old, loading: true }));
        getSongAndArtists(mopidy)
          ?.then((current) => {
            // console.log(`[TrackListPage:volumeChanged] newSongAndArtists:\n`, current);
            setState((old) => ({ ...old, loading: false, current }));
          })
          .catch((reason) => {
            setState((old) => ({ ...old, loading: false }));
            alert(formatErr(reason));
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
    setState((old) => ({ ...old, loading: true }));
    Promise.all([getSongAndArtists(mopidy), getTrackList(mopidy, +wantedImgHeight.replace('px', ''))])
      .then(([current, songs]) => {
        // console.log(`[TrackListPage:online] ${songs?.length} songs, current:\n`, current);
        // console.log(`[TrackListPage:online] ${songs?.length} songs:\n`, songs);
        setState((old) => ({
          ...old,
          loading: false,
          current: current ?? old.current,
          songs: songs ?? old.songs,
        }));
      })
      .catch((reason) => {
        setState((old) => ({ ...old, loading: false }));
        alert(formatErr(reason));
      });
  }, [mopidy, online, wantedImgHeight]);

  function handleSelection(song: SongAndArtists) {
    // console.log(`[TrackListPage:handleSelection] song:\n`, song);
    if (song.tlid) {
      setState((old) => ({ ...old, loading: true }));
      playSelection(mopidy, song.tlid)
        ?.catch((reason) => alert(formatErr(reason)))
        .finally(() => setState((old) => ({ ...old, loading: false })));
    }
  }

  function goBack() {
    emptyHistory ? navigate('/player') : navigate(-1);
  }

  // console.log(`[TrackListPage] getUA:\n`, getUA);
  console.log(`[TrackListPage] agent:\n`, agent);
  console.log(`[TrackListPage] agent.isIPhone = ${ifIPhone(true, false)}, agent.isTablet = ${isTablet}`);

  const primaryTypoFontSize = useBreakpointValue({ fontSize: '1.15rem' }, { fontSize: '1.25rem' });
  const liPx = 0.5;

  return (
    <Stack
      className={`${pageStyles.page} ${ifIPhone(pageStyles.iphone, '')}`}
      // className={`${styles.stack} ${ifIPhone(styles.iPhone, '')}`}
      spacing={state.loading ? [0] : [0.5]}
    >
      <ShowIf condition={!state.loading}>
        <ShowIf condition={!state.songs.length}>
          <Typography variant="h6" className={pageStyles.title}>
            The list is empty!
          </Typography>
        </ShowIf>
        <ShowIf condition={!!state.songs.length}>
          <List className={styles.ul} sx={state.loading ? { display: 'none' } : {}}>
            {state.songs
              .filter((sa) => !!sa.song)
              .map((sa, i) => (
                <ListItemButton
                  key={i}
                  autoFocus={sa.tlid == state.current.tlid}
                  selected={sa.tlid == state.current.tlid}
                  sx={{ px: liPx, py: [1.2, 0.75], border: 'solid thin rgba(0, 0, 0, 0.2)' }}
                  onClick={() => handleSelection(sa)}
                >
                  {sa.imgUri && (
                    <ListItemAvatar
                      sx={{
                        marginRight: liPx,
                        lineHeight: 0,
                        minWidth: 0,
                        maxWidth: `min(15%, ${wantedImgHeight})`,
                      }}
                    >
                      <img src={sa.imgUri} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    sx={{ wordBreak: 'break-word' }}
                    primary={sa.song}
                    primaryTypographyProps={{
                      letterSpacing: 0,
                      lineHeight: sa.artists ? 1.5 : 1,
                      ...primaryTypoFontSize,
                    }}
                    secondary={sa.artists}
                    secondaryTypographyProps={{ letterSpacing: 0, lineHeight: 1 }}
                  />
                </ListItemButton>
              ))}
          </List>
        </ShowIf>
      </ShowIf>
      <ShowIf condition={state.loading}>
        <Spinner />
      </ShowIf>
      <Button variant="outlined" onClick={goBack} sx={{ py: [2, 1.5] }}>
        Back
      </Button>
      <Logs logs={logs} />
    </Stack>
  );
}
