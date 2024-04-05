import { Button, Chip, Stack } from '@mui/material';
import Mopidy from 'mopidy';
import { useCallback, useEffect, useRef, useState } from 'react';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { debounce } from 'lodash';
import ExactVolume from './ui/ExactVolume';
import VolumeSlider from './ui/VolumeSlider';
import VolumeButtons from './ui/VolumeButtons';
import { setVolume as setMopidyVolume } from './lib/mpc';

// type CoreListenerEvent = keyof Mopidy.core.CoreListener;
const DEFAULT_EXACT_VOLUME = 9;

function Volume() {
  // console.log(`[Volume]`);

  const [volume, setVolume] = useState(0);
  const [sliderVolume, setSliderVolume] = useState(0);
  const [debouncedSliderVolume, setDebouncedSliderVolume] = useState<number | null>();
  const [exactVolume, setExactVolume] = useState(DEFAULT_EXACT_VOLUME);
  const [disabled, setDisabled] = useState(true);
  const [rand, setRand] = useState(0);

  // console.log(`[Volume] volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);
  // alert(`volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);

  // const location = useLocation();
  // const navigate = useNavigate();

  const mopidyRef = useRef<Mopidy | null>(null);

  useEffect(() => {
    setExactVolume(DEFAULT_EXACT_VOLUME);

    const mopidy = (mopidyRef.current = new Mopidy({ webSocketUrl: '' }));
    // console.log(`[useEffect] rand = ${rand}, mopidy:`, mopidy);

    mopidy.on('websocket:close', async () => {
      // console.log(`[websocket:close] rand = ${rand}`, mopidy);
    });

    /* mopidy.on('websocket:error', async (e: object | string) => {
      // console.log(`[websocket:error] rand = ${rand}`, mopidy);
      console.error('Something went wrong with the Mopidy connection!', e);
    }); */

    mopidy.on('state:offline', async () => {
      // console.log(`[state:offline] rand = ${rand}`, mopidy);
      setDisabled(true);
    });

    mopidy.on('state:online', async () => {
      // console.log(`[state:online] rand = ${rand}`, mopidy);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      setDisabled(false);
      const serverVolume = await mopidy.mixer?.getVolume();
      if (serverVolume != null) {
        setVolume(serverVolume);
        setSliderVolume(serverVolume);
      }
    });

    /* mopidy.on('state:volumeChanged' as CoreListenerEvent, async ({ volume }: { volume: number }) => {
      // console.log(`[state:volumeChanged] rand = ${rand}, volume = ${volume}`);
      setVolume(volume);
    }); */

    return () => {
      // console.log(`[useEffect:destroy] rand = ${rand}`, mopidy);
      mopidyRef.current = null;
      mopidy.close()?.then(() => mopidy.off());
    };
  }, [rand]);

  // setVolume
  useEffect(() => {
    if (debouncedSliderVolume == null) {
      console.warn(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}, mopidyRef = false`);
      return;
    } else if (mopidyRef.current == null) {
      console.error(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}, mopidyRef = true`);
      return;
    }
    // console.log(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}`);
    setMopidyVolume(() => setVolume(debouncedSliderVolume), debouncedSliderVolume, mopidyRef.current);
  }, [debouncedSliderVolume]);

  const setDebouncedSliderVolumeFn = useCallback(debounce(setDebouncedSliderVolume, 300), []);

  // setSliderVolume
  function handleSliderVolume(newSliderVolume: number) {
    // console.log(`[handleSliderVolume] newSliderVolume = ${newSliderVolume}`);
    if (mopidyRef.current) {
      setSliderVolume(newSliderVolume);
      setDebouncedSliderVolumeFn(newSliderVolume);
    } else {
      // console.error(`[handleSliderVolume] rand = ${rand}, newSliderVolume = ${newSliderVolume}, mopidyRef = false`);
      alert(`rand = ${rand}, newSliderVolume = ${newSliderVolume}, mopidyRef = false`);
    }
  }

  function handleExactVolume(newExactVolume: number) {
    // console.log(`[handleExactVolume] newExactVolume = ${newExactVolume}`);
    if (mopidyRef.current && newExactVolume >= 0 && newExactVolume <= 100) {
      // console.log(`[mopidy] newExactVolume = ${newExactVolume}`);
      setMopidyVolume(
        () => {
          setVolume(newExactVolume);
          setSliderVolume(newExactVolume);
        },
        newExactVolume,
        mopidyRef.current
      );
    } else {
      // console.error(`[handleExactVolume] rand = ${rand}, newExactVolume = ${newExactVolume}, mopidyRef = false`);
      alert(`rand = ${rand}, newExactVolume = ${newExactVolume}, mopidyRef = false`);
    }
  }

  const btnStyle = { py: [3, 2] };

  return (
    <Stack sx={{ height: '100%', alignItems: 'center' }}>
      <Stack spacing={2} sx={{ height: '100%', justifyContent: 'center', width: '100%', maxWidth: '300px' }}>
        <Button variant="outlined" size="large" sx={btnStyle} onClick={() => setRand(Math.random())}>
          <AutorenewIcon />
        </Button>
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
          sliderVolume={sliderVolume}
          handleSliderVolume={handleSliderVolume}
        />
        <Chip variant="outlined" icon={<GraphicEqIcon />} label={volume} sx={{ fontWeight: 'bold' }} />
        <VolumeButtons
          btnStyle={btnStyle}
          disabled={disabled}
          volume={volume}
          handleExactVolume={handleExactVolume}
        />
      </Stack>
    </Stack>
  );
}

export default Volume;
