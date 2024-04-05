import { Chip, Stack } from '@mui/material';
import Mopidy from 'mopidy';
import { useEffect, useRef, useState } from 'react';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import ExactVolume from './ui/ExactVolume';
import VolumeSlider from './ui/VolumeSlider';
import VolumeButtons from './ui/VolumeButtons';
import { mute as muteMopidy, setVolume as setMopidyVolume } from './lib/mpc';
import AudioPanel from './ui/AudioPanel';

// type CoreListenerEvent = keyof Mopidy.core.CoreListener;
const DEFAULT_EXACT_VOLUME = 9;

function VolumePage() {
  // console.log(`[Volume]`);

  const [mute, setMute] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [volume, setVolume] = useState(0);
  const [exactVolume, setExactVolume] = useState(DEFAULT_EXACT_VOLUME);
  const [disabled, setDisabled] = useState(true);
  const [rand, setRand] = useState(0);

  // console.log(`[Volume] volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);
  // alert(`volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);

  // const location = useLocation();
  // const navigate = useNavigate();

  const mopidyRef = useRef<Mopidy | null>(null);

  useEffect(() => {
    // console.log(`[useEffect] rand = ${rand}`);
    setExactVolume(DEFAULT_EXACT_VOLUME);

    const mopidy = (mopidyRef.current = new Mopidy({ webSocketUrl: '' }));
    // console.log(`[useEffect] rand = ${rand}, mopidy:`, mopidy);

    mopidy.on('websocket:close', async () => {
      // console.log(`[websocket:close] rand = ${rand}`, mopidy);
    });

    mopidy.on('state:offline', async () => {
      // console.log(`[state:offline] rand = ${rand}`, mopidy);
      setDisabled(true);
    });

    mopidy.on('state:online', async () => {
      // console.log(`[state:online] rand = ${rand}`, mopidy);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      const serverMute = await mopidy.mixer?.getMute();
      if (serverMute != null) {
        setMute(serverMute);
      }
      const serverVolume = await mopidy.mixer?.getVolume();
      if (serverVolume != null) {
        setVolume(serverVolume);
        setSliderValue(serverVolume);
      }
      setDisabled(false);
    });

    /* mopidy.on('websocket:error', async (e: object | string) => {
      // console.log(`[websocket:error] rand = ${rand}`, mopidy);
      console.error('Something went wrong with the Mopidy connection!', e);
    });

    mopidy.on('state:volumeChanged' as CoreListenerEvent, async ({ volume }: { volume: number }) => {
      // console.log(`[state:volumeChanged] rand = ${rand}, volume = ${volume}`);
      setVolume(volume);
    }); */

    return () => {
      // console.log(`[useEffect:destroy] rand = ${rand}`);
      mopidyRef.current = null;
      mopidy.close()?.then(() => mopidy.off());
    };
  }, [rand]);

  function doSetMopidyVolume(newValue: number, onSuccess?: (volume: number) => void) {
    // console.log(`[doSetMopidyVolume] mopidyRef = ${!!mopidyRef.current}, rand = ${rand}, newValue = ${newValue}`);
    if (mopidyRef.current) {
      setMopidyVolume(v => {
        setVolume(v);
        onSuccess && onSuccess(v);
      }, newValue, mopidyRef.current);
    } else {
      // console.error(`[doSetMopidyVolume] mopidyRef = false, rand = ${rand}, newValue = ${newValue}`);
      alert(`[doSetMopidyVolume] mopidyRef = false, rand = ${rand}, newValue = ${newValue}`);
    }
  }

  function handleSlide(newSlidingVolume: number) {
    // console.log(`[handleSlide] mopidyRef = ${!!mopidyRef.current}, rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
    if (mopidyRef.current) {
      doSetMopidyVolume(newSlidingVolume, setSliderValue);
    } else {
      // console.error(`[handleSlide] mopidyRef = false, rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
      alert(`[handleSlide] mopidyRef = false, rand = ${rand}, newSlidingVolume = ${newSlidingVolume}`);
    }
  }

  function handleExactVolume(newVolume: number) {
    // console.log(`[handleExactVolume] mopidyRef = ${!!mopidyRef.current}, rand = ${rand}, newVolume = ${newVolume}`);
    if (mopidyRef.current) {
      doSetMopidyVolume(newVolume, setSliderValue);
    } else {
      // console.error(`[handleExactVolume] mopidyRef = false, rand = ${rand}, newVolume = ${newVolume}`);
      alert(`[handleExactVolume] mopidyRef = false, rand = ${rand}, newVolume = ${newVolume}`);
    }
  }

  function handleMute() {
    muteMopidy(setMute, !mute, mopidyRef.current);
  }

  const btnStyle = { py: [3, 2] };

  return (
    <Stack sx={{ height: '100%', alignItems: 'center' }}>
      <Stack spacing={2} sx={{ height: '100%', justifyContent: 'center', width: '100%', maxWidth: '300px' }}>
        <ExactVolume
          disabled={disabled}
          exactVolume={exactVolume}
          setExactVolume={setExactVolume}
          handleExactVolume={handleExactVolume}
          inputStyle={{ paddingLeft: btnStyle.py }}
          iconStyle={{ p: btnStyle.py }}
        />
        <VolumeSlider
          disabled={disabled}
          mute={mute}
          volume={sliderValue}
          setVolume={setSliderValue}
          onMute={handleMute}
          onSlide={handleSlide}
        />
        <Chip variant="outlined" icon={<GraphicEqIcon />} label={volume} sx={{ fontWeight: 'bold' }} />
        <VolumeButtons
          btnStyle={btnStyle}
          disabled={disabled}
          volume={volume}
          handleExactVolume={handleExactVolume}
        />
        <AudioPanel
          play={() => setRand(Math.random())}
          stop={() => setRand(Math.random())}
          refresh={() => setRand(Math.random())}
        />
      </Stack>
    </Stack>
  );
}

export default VolumePage;
