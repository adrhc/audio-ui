import { Box, Stack, Typography } from '@mui/material';
import Mopidy, { models } from 'mopidy';
import { useEffect, useRef, useState } from 'react';
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
import Logs from './ui/Logs';
import { PlaybackState } from './lib/types';
import { TITLE, rowHeight } from './ui/VolumePage-styles';
import ExactVolumePanel from './ui/ExactVolumePanel';
import { collectSongAndArtists, LOG_TLT, SongAndArtists, toSongAndArtists } from './lib/util/VolumePage';

const SHOW_LOGS = false;
// const DEFAULT_EXACT_VOLUME = 5; // KEF = 75

type CoreListenerEvent = keyof Mopidy.core.CoreListener;

function VolumePage() {
  // console.log(`[Volume]`);

  const [songAndArtists, setSongAndArtists] = useState<SongAndArtists>({});
  const [mute, setMute] = useState(false);
  const [pbState, setPbState] = useState<PlaybackState>();
  const [volume, setVolume] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  // const [exactVolume, setExactVolume] = useState(DEFAULT_EXACT_VOLUME);
  const [disabled, setDisabled] = useState(true);
  const [rand, setRand] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // console.log(`[Volume] volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);
  // alert(`volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);

  // const location = useLocation();
  // const navigate = useNavigate();

  const mopidyRef = useRef<Mopidy | null>(null);

  function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    // setExactVolume(DEFAULT_EXACT_VOLUME);

    const mopidy = (mopidyRef.current = new Mopidy({ webSocketUrl: '' }));
    // console.log(`[useEffect] rand = ${rand}`);
    // addLog(`[useEffect] rand = ${rand}`);

    mopidy.on('websocket:error', async (e: object | string) => {
      // console.error(`[websocket:error] rand = ${rand}`, e);
      // console.error('Something went wrong with the Mopidy connection!', e);
      addLog(
        `[websocket:error] rand = ${rand}, ${JSON.stringify(e, ['message', 'arguments', 'type', 'name'])}`
      );
    });

    /* mopidy.on('websocket:incomingMessage', (param: string | number | boolean | object | []) => {
      if (typeof param?.data === 'string') {
        const json = JSON.parse(param.data);
        const result = json.result ?? json.tl_track;
        if (result && result['__model__'] === 'TlTrack') {
          console.log(`[websocket:incomingMessage] ${Date.now()}, TlTrack:`, json);
          logTlTrack(result as models.TlTrack);
          return;
        }
      }
      if (param?.data) {
        console.log(`[websocket:incomingMessage] ${Date.now()}, data:\n`, param.data);
      }
      // addLog(`[websocket:close] rand = ${rand}`);
    }); */

    mopidy.on('websocket:close', () => {
      // console.log(`[websocket:close] rand = ${rand}`);
      // addLog(`[websocket:close] rand = ${rand}`);
    });

    mopidy.on('state:offline', () => {
      // console.log(`[state:offline] rand = ${rand}`);
      // addLog(`[state:offline] rand = ${rand}`);
      setDisabled(true);
    });

    mopidy.on('state:online', async () => {
      // console.log(`[state:online] rand = ${rand}`);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      LOG_TLT && console.log(`[state:online] TlTrack:`);
      collectSongAndArtists(setSongAndArtists, mopidy);

      const mute = await mopidy.mixer?.getMute();
      if (mute != null) {
        setMute(mute);
      }
      const volume = await mopidy.mixer?.getVolume();
      if (volume != null) {
        setVolume(volume);
        setSliderValue(volume);
      }
      const pbState = await mopidy.playback?.getState();
      if (pbState != null) {
        setPbState(pbState);
      }
      setDisabled(false);
      // console.log(`[state:online] rand = ${rand}, mute = ${mute}, volume = ${volume}, pbState = ${pbState}`);
    });

    mopidy.on('event:muteChanged' as CoreListenerEvent, ({ mute }: { mute: boolean }) => {
      // console.log(`[event:muteChanged] rand = ${rand}, mute = ${mute}`);
      // addLog(`[event:muteChanged] rand = ${rand}, mute = ${mute}`);
      setMute(mute);
    });

    mopidy.on(
      'event:playbackStateChanged' as CoreListenerEvent,
      ({ new_state }: { old_state: PlaybackState; new_state: PlaybackState }) => {
        /* console.log(
          `[event:playbackStateChanged] rand = ${rand}, old_state = ${JSON.stringify(old_state)}, new_state = ${JSON.stringify(new_state)}`
        ); */
        // addLog(`[event:playbackStateChanged] rand = ${rand}, old_state = ${JSON.stringify(old_state)}, new_state = ${JSON.stringify(new_state)`);
        setPbState(new_state);
      }
    );

    mopidy.on('event:trackPlaybackStarted' as CoreListenerEvent, (params: { tl_track: models.TlTrack }) => {
      if (LOG_TLT) {
        console.log(`[event:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
        logTlTrack(params.tl_track);
      }
      const songAndArtists = toSongAndArtists(params.tl_track);
      setSongAndArtists(songAndArtists);
    });

    mopidy.on('event:volumeChanged' as CoreListenerEvent, ({ volume }: { volume: number }) => {
      // addLog(`[event:volumeChanged] rand = ${rand}, volume = ${volume}`);
      // console.log(`[event:volumeChanged] ${Date.now()}, rand = ${rand}, volume = ${volume}`);
      LOG_TLT && console.log(`[event:volumeChanged] ${Date.now()}, TlTrack:`);
      collectSongAndArtists(setSongAndArtists, mopidy);
      setVolume(volume);
      setSliderValue(volume);
    });

    return () => {
      // console.log(`[useEffect:destroy] rand = ${rand}`);
      mopidyRef.current = null;
      // addLog(`[useEffect:destroy] rand = ${rand}`);
      mopidy.close()?.then(() => mopidy.off());
    };
  }, [rand]);

  function doSetMopidyVolume(newValue: number) {
    // console.log(`[doSetMopidyVolume] rand = ${rand}, newValue = ${newValue}`);
    // addLog(`[doSetMopidyVolume] rand = ${rand}, newValue = ${newValue}`);
    if (mopidyRef.current) {
      setMopidyVolume(mopidyRef.current, newValue);
    } else {
      // console.error(`[doSetMopidyVolume] mopidyRef = false, rand = ${rand}, newValue = ${newValue}`);
      alert(`[doSetMopidyVolume] mopidyRef = false, rand = ${rand}, newValue = ${newValue}`);
    }
  }

  function handleSlide(newSlidingVolume: number) {
    // console.log(`[handleSlide] rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
    // addLog(`[handleSlide] rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
    if (mopidyRef.current) {
      doSetMopidyVolume(newSlidingVolume);
    } else {
      // console.error(`[handleSlide] mopidyRef = false, rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
      alert(`[handleSlide] mopidyRef = false, rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
    }
  }

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
          volume={sliderValue}
          setVolume={setSliderValue}
          onMute={() => muteMopidy(mopidyRef.current, !mute)}
          onSlide={handleSlide}
          // addLog={addLog}
        />
        {/* <Chip
          sx={{
            fontSize: inputFontSize,
            py: YS,
            fontWeight: 'bold',
            lineHeight: 1,
          }}
          variant="outlined"
          icon={<GraphicEqIcon sx={{ fontSize: iconFontSize }} />}
          label={volume}
        /> */}
        <VolumeButtons disabled={disabled} volume={volume} handleExactVolume={doSetMopidyVolume} />
        <PlaybackPanel
          disabled={disabled}
          state={pbState}
          previous={() => previous(mopidyRef.current)}
          next={() => next(mopidyRef.current)}
          pause={() => pauseMopidy(mopidyRef.current)}
          stop={() => stopMopidy(mopidyRef.current)}
          play={() => playMopidy(mopidyRef.current)}
          resume={() => resumeMopidy(mopidyRef.current)}
          reload={() => setRand(Math.random())}
        />
      </Stack>
      <Logs logs={logs} />
    </Stack>
  );
}

export default VolumePage;
