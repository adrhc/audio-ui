import { Box, Stack, Typography } from '@mui/material';
import Mopidy, { models } from 'mopidy';
import { useContext, useEffect, useState } from 'react';
import VolumeButtons from '../../ui/panel/VolumeButtons';
import {
  setVolume as setMopidyVolume,
  mute as muteMopidy,
  stop as stopMopidy,
  pause as pauseMopidy,
  resume as resumeMopidy,
  next,
  previous,
  SongAndArtists,
  toSongAndArtists,
  getSongAndArtists,
} from '../../lib/mpc';
import { safelyPlayCurrent } from '../../lib/player';
import PlaybackPanel from '../../ui/panel/PlaybackPanel';
import { CoreListenerEvent, MopidyEvent, PlaybackState } from '../../lib/types';
import { panelHeight } from './styles';
import ExactVolumePanel from '../../ui/panel/ExactVolumePanel';
import { AppContext } from '../../App';
// import Logs from '../ui/Logs';
// import { SHOW_LOGS } from '../lib/config';
import MopidyPlayOptions from '../../ui/panel/MopidyPlayOptions';
import ShowIf from '../../ui/ShowIf';
import PrevNextPanel from '../../ui/panel/PrevNextPanel';
import KefLSXPanel from '../../ui/panel/KefLSXPanel';
import { isAdrhc } from '../../lib/adrhc';
import '../../ui/panel/panel.scss';
import styles from './styles.module.scss';

type VolumePageState = {
  pbStatus?: PlaybackState;
  volume: number;
  mute: boolean;
  tuneOn: boolean;
  songAndArtists: SongAndArtists;
};

export default function VolumePage() {
  const { mopidy, online } = useContext(AppContext);
  // const [logs, setLogs] = useState<string[]>([]);
  const [state, setState] = useState<VolumePageState>({
    tuneOn: false,
    volume: 0,
    mute: false,
    songAndArtists: {},
  });

  const adrhc = isAdrhc();

  console.log(`[VolumePage] isAdrhc = ${adrhc}, online = ${online}, state:\n`, state);

  /* function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  } */

  useEffect(() => {
    console.log(`[VolumePage:online] online = ${online}`);
    if (!online) {
      return;
    }

    // console.log(`[VolumePage:online]`);
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
        setState((old) => ({
          ...old,
          pbStatus: newPbStatus ?? old.pbStatus,
          volume: newVolume ?? old.volume,
          mute: newMute ?? old.mute,
          songAndArtists: newSongAndArtists ?? old.songAndArtists,
        }));
      })
      .catch((reason) => {
        alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
      });
  }, [mopidy, online]);

  useEffect(() => {
    console.log(`[VolumePage:mopidy]`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push([
      'event:trackPlaybackStarted' as CoreListenerEvent,
      (params: { tl_track: models.TlTrack }) => {
        // console.log(`[VolumePage:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
        // logTlTrack(params.tl_track);
        setState((old) => ({ ...old, songAndArtists: toSongAndArtists(params.tl_track) }));
      },
    ]);

    events.push([
      'event:muteChanged' as CoreListenerEvent,
      ({ mute }: { mute: boolean }) => {
        console.log(`[VolumePage:muteChanged] mute = ${mute}`);
        // addLog(`[VolumePage:muteChanged] mute = ${mute}`);
        setState((old) => ({ ...old, mute }));
      },
    ]);

    events.push([
      'event:playbackStateChanged' as CoreListenerEvent,
      ({ new_state: pbStatus }: { old_state: PlaybackState; new_state: PlaybackState }) => {
        console.log(`[VolumePage:playbackStateChanged] pbStatus = ${pbStatus}`);
        // addLog(`[VolumePage:playbackStateChanged] old_state = ${old_state}, pbStatus = ${pbStatus}`);
        setState((old) => ({ ...old, pbStatus }));
      },
    ]);

    events.push([
      'event:volumeChanged' as CoreListenerEvent,
      ({ volume }: { volume: number }) => {
        // addLog(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, volume = ${volume}`);
        // console.log(`[VolumePage:volumeChanged] ${Date.now()}, TlTrack:`);
        console.log(`[VolumePage:volumeChanged] volume = ${volume}`);
        getSongAndArtists(mopidy)?.then((songAndArtists) => {
          console.log(`[VolumePage:volumeChanged] newSongAndArtists:\n`, songAndArtists);
          setState((old) => ({ ...old, volume, songAndArtists }));
        });
      },
    ]);

    events.forEach((e) => mopidy.on(...e));

    return () => {
      console.log(`[VolumePage:destroy]`);
      events.forEach((e) => mopidy.off(...e));
    };
  }, [mopidy]);

  function onVolumeChange(newValue: number) {
    console.log(`[VolumePage:onVolumeChange] newValue = ${newValue}`);
    // addLog(`[VolumePage:onVolumeChange] newValue = ${newValue}`);
    if (mopidy != null) {
      setMopidyVolume(mopidy, newValue);
    } else {
      console.error(`[VolumePage:onVolumeChange] newValue = ${newValue}`, mopidy);
      alert(`[VolumePage:onVolumeChange] newValue = ${newValue}`);
    }
  }

  return (
    <Stack sx={{ height: '100%', alignItems: 'center' }}>
      <Stack className={styles.container} spacing={1} sx={{ '& > div': { height: panelHeight } }}>
        <Box sx={{ height: 'auto !important' }}>
          <Typography variant="h6" className={styles.title}>
            {state.songAndArtists.song}
          </Typography>
          <Typography variant="h6" className={styles.title}>
            {state.songAndArtists.artists}
          </Typography>
        </Box>
        <ExactVolumePanel
          disabled={!online}
          volume={state.volume}
          // exactVolume={exactVolume}
          // setExactVolume={setExactVolume}
          handleExactVolume={onVolumeChange}
        />
        {/* <VolumeSlider
          disabled={!online}
          mute={state.mute}
          volume={state.volume}
          onMute={() => muteMopidy(mopidy, !state.mute)}
          onSlide={onVolumeChange}
        /> */}
        <PlaybackPanel
          disabled={!online}
          status={state.pbStatus}
          mute={state.mute}
          onMute={() => muteMopidy(mopidy, !state.mute)}
          pause={() => pauseMopidy(mopidy)}
          stop={() => stopMopidy(mopidy)}
          play={() => safelyPlayCurrent(mopidy)}
          resume={() => resumeMopidy(mopidy)}
        />
        <VolumeButtons
          disabled={!online}
          badgeColor="info"
          volume={state.volume}
          handleExactVolume={onVolumeChange}
        />
        <PrevNextPanel
          disabled={!online}
          previous={() => previous(mopidy)}
          next={() => next(mopidy)}
          toggleTune={() => setState((old) => ({ ...old, tuneOn: !state.tuneOn }))}
        />
        <ShowIf condition={state.tuneOn}>
          <MopidyPlayOptions />
        </ShowIf>
        <ShowIf condition={adrhc && state.tuneOn}>
          <KefLSXPanel />
        </ShowIf>
      </Stack>
      {/* <Logs logs={logs} /> */}
    </Stack>
  );
}
