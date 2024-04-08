import { Box, Stack, Typography } from '@mui/material';
import Mopidy, { models } from 'mopidy';
import { useContext, useEffect, useState } from 'react';
import VolumeSlider from './ui/VolumeSlider';
import VolumeButtons from './ui/VolumeButtons';
import {
  setVolume as setMopidyVolume,
  mute as muteMopidy,
  stop as stopMopidy,
  pause as pauseMopidy,
  resume as resumeMopidy,
  play as playMopidy,
  next,
  previous,
  logTlTrack,
} from './lib/mpc';
import PlaybackPanel from './ui/PlaybackPanel';
import { CoreListenerEvent, MopidyEvent, PlaybackState } from './lib/types';
import { TITLE, rowHeight } from './ui/VolumePage-styles';
import ExactVolumePanel from './ui/ExactVolumePanel';
import { collectSongAndArtists, LOG_TLT, SongAndArtists, toSongAndArtists } from './lib/util/VolumePage';
import { AppContext } from './App';
import Logs from './ui/Logs';
import { SHOW_LOGS } from './lib/config';

function VolumePage() {
  // console.log(`[VolumePage]`);

  const { online, mopidyRef } = useContext(AppContext);
  const [logs, setLogs] = useState<string[]>([]);
  console.log(`[VolumePage] online = ${online}, mopidyRef = ${!!mopidyRef.current}`);
  const disabled = !online;

  const [songAndArtists, setSongAndArtists] = useState<SongAndArtists>({});
  const [mute, setMute] = useState(false);
  const [pbStatus, setPbStatus] = useState<PlaybackState>();
  const [volume, setVolume] = useState(0);

  // const location = useLocation();
  // const navigate = useNavigate();

  function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    const mopidy = mopidyRef.current;
    console.log(`[VolumePage:online] mopidy = ${!!mopidy}, online = ${online}`);

    if (!online) {
      return;
    }

    LOG_TLT && console.log(`[VolumePage:online] TlTrack:`);
    collectSongAndArtists(setSongAndArtists, mopidy);

    mopidy?.mixer?.getMute().then((it) => it != null && setMute(it));
    mopidy?.mixer?.getVolume().then((it) => {
      if (it != null) {
        setVolume(it);
      }
    });
    mopidy?.playback?.getState().then((it) => it != null && setPbStatus(it));
  }, [mopidyRef.current, online]);

  useEffect(() => {
    const mopidy = mopidyRef.current;
    console.log(`[VolumePage:mopidy] mopidy = ${!!mopidy}`);

    if (!mopidy) {
      return;
    }

    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push([
      'event:muteChanged' as CoreListenerEvent,
      ({ mute }: { mute: boolean }) => {
        // console.log(`[VolumePage:muteChanged] mute = ${mute}`);
        // addLog(`[VolumePage:muteChanged] mute = ${mute}`);
        setMute(mute);
      },
    ]);

    events.push([
      'event:playbackStateChanged' as CoreListenerEvent,
      ({ new_state }: { old_state: PlaybackState; new_state: PlaybackState }) => {
        /* console.log(
          `[VolumePage:playbackStateChanged] old_state = ${JSON.stringify(old_state)}, new_state = ${JSON.stringify(new_state)}`
        ); */
        // addLog(`[VolumePage:playbackStateChanged] old_state = ${JSON.stringify(old_state)}, new_state = ${JSON.stringify(new_state)`);
        setPbStatus(new_state);
      },
    ]);

    events.push([
      'event:trackPlaybackStarted' as CoreListenerEvent,
      (params: { tl_track: models.TlTrack }) => {
        if (LOG_TLT) {
          console.log(`[VolumePage:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
          logTlTrack(params.tl_track);
        }
        setSongAndArtists(toSongAndArtists(params.tl_track));
      },
    ]);

    events.push([
      'event:volumeChanged' as CoreListenerEvent,
      ({ volume }: { volume: number }) => {
        // addLog(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, volume = ${volume}`);
        LOG_TLT && console.log(`[VolumePage:volumeChanged] ${Date.now()}, TlTrack:`);
        collectSongAndArtists(setSongAndArtists, mopidy);
        setVolume(volume);
      },
    ]);

    events.forEach((e) => mopidy?.on(...e));

    return () => {
      console.log(`[VolumePage:mopidy:destroy]`);
      addLog(`[VolumePage:destroy]`);
      events.forEach((e) => mopidy?.off(...e));
    };
  }, [mopidyRef.current]);

  function doSetMopidyVolume(newValue: number) {
    const mopidy = mopidyRef.current;
    console.log(`[VolumePage:doSetMopidyVolume] newValue = ${newValue}`);
    // addLog(`[VolumePage:doSetMopidyVolume] newValue = ${newValue}`);
    if (mopidy != null) {
      setMopidyVolume(mopidy, newValue);
    } else {
      console.error(`[doSetMopidyVolume] mopidy = ${!!mopidy}, newValue = ${newValue}`, mopidy);
      alert(`[VolumePage:doSetMopidyVolume] mopidy = ${!!mopidy}, newValue = ${newValue}`);
    }
  }

  const mopidy = mopidyRef.current;
  return (
    <Stack sx={{ height: '100%', alignItems: 'center' }}>
      <Stack
        spacing={1}
        sx={{
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          // see https://www.whatismybrowser.com/w/66ZAAY4
          minWidth: '310px',
          maxWidth: '330px',
          '& > div': { height: rowHeight },
        }}
      >
        <Box sx={{ height: 'auto !important' }}>
          <Typography sx={TITLE}>{songAndArtists.song}</Typography>
          <Typography sx={TITLE}>{songAndArtists.artists}</Typography>
        </Box>
        <ExactVolumePanel
          disabled={disabled}
          volume={volume}
          // exactVolume={exactVolume}
          // setExactVolume={setExactVolume}
          handleExactVolume={doSetMopidyVolume}
        />
        <VolumeSlider
          disabled={disabled}
          mute={mute}
          volume={volume}
          onMute={() => muteMopidy(mopidy, !mute)}
          onSlide={doSetMopidyVolume}
        />
        <VolumeButtons disabled={disabled} volume={volume} handleExactVolume={doSetMopidyVolume} />
        <PlaybackPanel
          disabled={disabled}
          status={pbStatus}
          previous={() => previous(mopidy)}
          next={() => next(mopidy)}
          pause={() => pauseMopidy(mopidy)}
          stop={() => stopMopidy(mopidy)}
          play={() => playMopidy(mopidy)}
          resume={() => resumeMopidy(mopidy)}
        />
      </Stack>
      <Logs logs={logs} />
    </Stack>
  );
}

export default VolumePage;
