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
  collectSongAndArtists,
  SongAndArtists,
  toSongAndArtists,
} from './lib/mpc';
import PlaybackPanel from './ui/PlaybackPanel';
import { CoreListenerEvent, MopidyEvent, PlaybackState } from './lib/types';
import { TITLE, rowHeight } from './ui/VolumePage-styles';
import ExactVolumePanel from './ui/ExactVolumePanel';
import { AppContext } from './App';
import Logs from './ui/Logs';
import { SHOW_LOGS } from './lib/config';

type MuteVolStatus = {
  pbStatus?: PlaybackState;
  volume: number;
  mute: boolean;
};

function VolumePage() {
  const { online, mopidyRef } = useContext(AppContext);
  const disabled = !online;
  const [logs, setLogs] = useState<string[]>([]);
  const [songAndArtists, setSongAndArtists] = useState<SongAndArtists>({});
  const [muteVolStatus, setMuteVolStatus] = useState<MuteVolStatus>({ volume: 0, mute: false });
  // const [pbStatus, setPbStatus] = useState<PlaybackState>();
  // const [volume, setVolume] = useState(0);
  // const [mute, setMute] = useState(false);

  console.log(
    `[VolumePage]\nmopidyRef = ${!!mopidyRef.current}\nonline = ${online}\npbStatus = ${muteVolStatus.pbStatus}\nvolume = ${muteVolStatus.volume}\nmute = ${muteVolStatus.mute}\nsong = ${songAndArtists.song}\nartists = ${songAndArtists.artists}`
  );

  function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    const mopidy = mopidyRef.current;

    if (!mopidy || !online) {
      return;
    }

    console.log(`[VolumePage:online] online = ${online}, collectSongAndArtists`);
    collectSongAndArtists(setSongAndArtists, mopidy);

    Promise.all([mopidy.playback?.getState(), mopidy.mixer?.getVolume(), mopidy.mixer?.getMute()]).then(
      ([newPbStatus, newVolume, newMute]) => {
        console.log(
          `[VolumePage:online] newPbStatus = ${newPbStatus}, newVolume = ${newVolume}, newMute = ${newMute}`
        );
        setMuteVolStatus((previous) => ({
          pbStatus: newPbStatus ?? previous.pbStatus,
          volume: newVolume ?? previous.volume,
          mute: newMute ?? previous.mute,
        }));
      }
    );
  }, [online]);

  useEffect(() => {
    const mopidy = mopidyRef.current;

    if (!mopidy) {
      return;
    }

    console.log(`[VolumePage:mopidy] mopidy = ${!!mopidy}`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push([
      'event:trackPlaybackStarted' as CoreListenerEvent,
      (params: { tl_track: models.TlTrack }) => {
        // console.log(`[VolumePage:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
        // logTlTrack(params.tl_track);
        setSongAndArtists(toSongAndArtists(params.tl_track));
      },
    ]);

    events.push([
      'event:muteChanged' as CoreListenerEvent,
      ({ mute }: { mute: boolean }) => {
        console.log(`[VolumePage:muteChanged] mute = ${mute}, muteVolStatus:\n`, muteVolStatus);
        // addLog(`[VolumePage:muteChanged] mute = ${mute}`);
        // setMute(mute);
        setMuteVolStatus((previous) => ({ ...previous, mute }));
      },
    ]);

    events.push([
      'event:playbackStateChanged' as CoreListenerEvent,
      ({ new_state: pbStatus }: { old_state: PlaybackState; new_state: PlaybackState }) => {
        console.log(
          `[VolumePage:playbackStateChanged] pbStatus = ${pbStatus}, muteVolStatus:\n`,
          muteVolStatus
        );
        // addLog(`[VolumePage:playbackStateChanged] old_state = ${old_state}, pbStatus = ${pbStatus}`);
        // setPbStatus(pbStatus);
        setMuteVolStatus((previous) => ({ ...previous, pbStatus }));
      },
    ]);

    events.push([
      'event:volumeChanged' as CoreListenerEvent,
      ({ volume }: { volume: number }) => {
        // addLog(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, TlTrack:`);
        console.log(`[VolumePage:volumeChanged] volume = ${volume}, muteVolStatus:\n`, muteVolStatus);
        collectSongAndArtists(setSongAndArtists, mopidy);
        // setVolume(volume);
        setMuteVolStatus((previous) => ({ ...previous, volume }));
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
          volume={muteVolStatus.volume}
          // exactVolume={exactVolume}
          // setExactVolume={setExactVolume}
          handleExactVolume={doSetMopidyVolume}
        />
        <VolumeSlider
          disabled={disabled}
          mute={muteVolStatus.mute}
          volume={muteVolStatus.volume}
          onMute={() => muteMopidy(mopidy, !muteVolStatus.mute)}
          onSlide={doSetMopidyVolume}
        />
        <VolumeButtons
          disabled={disabled}
          volume={muteVolStatus.volume}
          handleExactVolume={doSetMopidyVolume}
        />
        <PlaybackPanel
          disabled={disabled}
          status={muteVolStatus.pbStatus}
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
