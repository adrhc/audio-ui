import { Button, InputAdornment, Slider, Stack, TextField, Typography } from '@mui/material';
import Mopidy from 'mopidy';
import { useEffect, useRef, useState } from 'react';
import { onEnterKey } from './lib/keys';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

type CoreListenerEvent = keyof Mopidy.core.CoreListener;
const DEFAULT_EXACT_VOLUME = 9;

function Volume() {
  // console.log(`[Volume]`);

  const [volume, setVolume] = useState(0);
  const [exactVolume, setExactVolume] = useState(DEFAULT_EXACT_VOLUME);
  const [disabled, setDisabled] = useState(true);
  const [rand, setRand] = useState(0);

  // console.log(`[Volume] volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);
  // alert(`volume = ${volume}, exactVolume = ${exactVolume}, disabled = ${disabled}`);

  // const location = useLocation();
  // const navigate = useNavigate();

  const ws = useRef<Mopidy | null>(null);

  useEffect(() => {
    /* if (ws.current) {
      console.log(`[useEffect2] ws.current = ${!!ws.current}`);
      return;
    } */

    setExactVolume(DEFAULT_EXACT_VOLUME);

    const mopidy = (ws.current = new Mopidy({ webSocketUrl: '' }));
    console.log(`[useEffect] rand = ${rand}, mopidy:`, mopidy);

    mopidy.on('websocket:close', async () => {
      console.log(`[websocket:close] rand = ${rand}`, mopidy);
    });

    mopidy.on('websocket:error', async (e: object | string) => {
      console.log(`[websocket:error] rand = ${rand}`, mopidy);
      console.error('Something went wrong with the Mopidy connection!', e);
    });

    mopidy.on('state:offline', async () => {
      console.log(`[state:offline] rand = ${rand}`, mopidy);
      setDisabled(true);
    });

    mopidy.on('state:online', async () => {
      console.log(`[state:online] rand = ${rand}`, mopidy);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      setDisabled(false);
      const serverVolume = await ws.current?.mixer?.getVolume();
      if (serverVolume != null) {
        setVolume(serverVolume);
      }
    });

    mopidy.on('state:volumeChanged' as CoreListenerEvent, async ({ volume }: { volume: number }) => {
      // console.log(`state:volumeChanged rand = ${rand}, volume = ${volume}`);
      setVolume(volume);
    });

    return () => {
      console.log(`[useEffect:destroy] rand = ${rand}`, mopidy);
      ws.current = null;
      mopidy.close()?.then(() => mopidy.off());
    };
  }, [rand]);

  function setMopidyVolume(newVolume: number) {
    // console.log(`[setMopidyVolume] newVolume = ${newVolume}`);
    if (ws.current && newVolume >= 0 && newVolume <= 100) {
      ws.current.mixer?.setVolume({ volume: newVolume }).then(() => setVolume(newVolume));
      // } else {
      // alert(`newVolume = ${newVolume}, ws.current = ${!!ws.current}`);
    }
  }

  function refresh() {
    setRand(Math.random());
  }

  const btnStyle = { py: [3, 2] };

  return (
    <>
      <Stack spacing={2} sx={{ justifyContent: 'center', height: '100%' }}>
        {/* <Link to="." reloadDocument={true} state={{}}> */}
        <Button variant="outlined" size="large" sx={btnStyle} onClick={refresh}>
          <AutorenewIcon />
        </Button>
        {/* </Link> */}
        <TextField
          disabled={disabled}
          type="number"
          label="the exact volume"
          value={exactVolume}
          onChange={(e) => setExactVolume(+e.target.value)}
          onKeyUp={(e) => onEnterKey(() => setMopidyVolume(exactVolume), e)}
          inputProps={{ min: 0, max: 100, style: { fontWeight: 'bold' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EqualizerIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" size="large" sx={btnStyle} onClick={() => setMopidyVolume(exactVolume)}>
          Set the volume to {exactVolume}
        </Button>
        <Stack direction="row" spacing={2} alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            value={volume || 0}
            onChange={(_e, newValue) => setMopidyVolume(newValue as number)}
          />
          <VolumeUp />
        </Stack>
        <Button variant="outlined" size="large" sx={btnStyle} onClick={() => setMopidyVolume(volume + 1)}>
          <AddCircleIcon />
        </Button>
        <Typography textAlign="center" sx={{ fontWeight: 'bold' }}>
          {volume}
        </Typography>
        <Button variant="outlined" size="large" sx={btnStyle} onClick={() => setMopidyVolume(volume - 1)}>
          <RemoveCircleIcon />
        </Button>
      </Stack>
    </>
  );
}

export default Volume;
