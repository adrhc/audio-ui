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
  SongAndArtists,
  toSongAndArtists,
  getSongAndArtists,
} from './lib/mpc';
import PlaybackPanel from './ui/PlaybackPanel';
import { CoreListenerEvent, MopidyEvent, PlaybackState } from './lib/types';
import { TITLE, rowHeight } from './ui/VolumePage-styles';
import ExactVolumePanel from './ui/ExactVolumePanel';
import { AppContext } from './App';
import Logs from './ui/Logs';
import { SHOW_LOGS } from './lib/config';

type VolumePageState = {
  pbStatus?: PlaybackState;
  volume: number;
  mute: boolean;
  songAndArtists: SongAndArtists;
};

function VolumePage() {
  const { online, mopidyRef } = useContext(AppContext);
  const disabled = !online || !mopidyRef.current;
  const [logs, setLogs] = useState<string[]>([]);
  const [state, setState] = useState<VolumePageState>({ volume: 0, mute: false, songAndArtists: {} });
  // const [pbStatus, setPbStatus] = useState<PlaybackState>();
  // const [volume, setVolume] = useState(0);
  // const [mute, setMute] = useState(false);

  console.log(
    `[VolumePage]\nmopidy = ${!!mopidyRef.current}\nonline = ${online}\npbStatus = ${state.pbStatus}\nvolume = ${state.volume}\nmute = ${state.mute}\nsong = ${state.songAndArtists.song}\nartists = ${state.songAndArtists.artists}`
  );

  function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    const mopidy = mopidyRef.current;

    // console.log(`[VolumePage:online] mopidy = ${!!mopidy}, online = ${online}`);
    if (!mopidy || !online) {
      return;
    }

    console.log(`[VolumePage:online]`);
    Promise.all([
      mopidy.playback?.getState(),
      mopidy.mixer?.getVolume(),
      mopidy.mixer?.getMute(),
      getSongAndArtists(mopidy),
    ])
      .then(([newPbStatus, newVolume, newMute, newSongAndArtists]) => {
        console.log(
          `[VolumePage:online] newPbStatus = ${newPbStatus}, newVolume = ${newVolume}, newMute = ${newMute}, newSongAndArtists:\n`,
          newSongAndArtists
        );
        setState((previous) => ({
          pbStatus: newPbStatus ?? previous.pbStatus,
          volume: newVolume ?? previous.volume,
          mute: newMute ?? previous.mute,
          songAndArtists: newSongAndArtists ?? previous.songAndArtists,
        }));
      })
      .catch((reason) => {
        alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
      });
  }, [online]);

  useEffect(() => {
    const mopidy = mopidyRef.current;

    // console.log(`[VolumePage:mopidy] mopidy = ${!!mopidy}, online = ${online}`);
    if (!mopidy) {
      return;
    }

    console.log(`[VolumePage:mopidy]`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push([
      'event:trackPlaybackStarted' as CoreListenerEvent,
      (params: { tl_track: models.TlTrack }) => {
        // console.log(`[VolumePage:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
        // logTlTrack(params.tl_track);
        setState((previous) => ({ ...previous, songAndArtists: toSongAndArtists(params.tl_track) }));
      },
    ]);

    events.push([
      'event:muteChanged' as CoreListenerEvent,
      ({ mute }: { mute: boolean }) => {
        console.log(`[VolumePage:muteChanged] mute = ${mute}, state:\n`, state);
        // addLog(`[VolumePage:muteChanged] mute = ${mute}`);
        setState((previous) => ({ ...previous, mute }));
      },
    ]);

    events.push([
      'event:playbackStateChanged' as CoreListenerEvent,
      ({ new_state: pbStatus }: { old_state: PlaybackState; new_state: PlaybackState }) => {
        console.log(`[VolumePage:playbackStateChanged] pbStatus = ${pbStatus}, state:\n`, state);
        // addLog(`[VolumePage:playbackStateChanged] old_state = ${old_state}, pbStatus = ${pbStatus}`);
        setState((previous) => ({ ...previous, pbStatus }));
      },
    ]);

    events.push([
      'event:volumeChanged' as CoreListenerEvent,
      ({ volume }: { volume: number }) => {
        // addLog(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, TlTrack:`);
        console.log(`[VolumePage:volumeChanged] volume = ${volume}, state:\n`, state);
        getSongAndArtists(mopidy)?.then((songAndArtists) => {
          console.log(`[VolumePage:volumeChanged] newSongAndArtists:\n`, songAndArtists);
          setState((previous) => ({ ...previous, volume, songAndArtists }));
        });
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
          <Typography sx={TITLE}>{state.songAndArtists.song}</Typography>
          <Typography sx={TITLE}>{state.songAndArtists.artists}</Typography>
        </Box>
        <ExactVolumePanel
          disabled={disabled}
          volume={state.volume}
          // exactVolume={exactVolume}
          // setExactVolume={setExactVolume}
          handleExactVolume={doSetMopidyVolume}
        />
        <VolumeSlider
          disabled={disabled}
          mute={state.mute}
          volume={state.volume}
          onMute={() => muteMopidy(mopidy, !state.mute)}
          onSlide={doSetMopidyVolume}
        />
        <VolumeButtons disabled={disabled} volume={state.volume} handleExactVolume={doSetMopidyVolume} />
        <PlaybackPanel
          disabled={disabled}
          status={state.pbStatus}
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
