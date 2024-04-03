import { Button, InputAdornment, Slider, Stack, TextField, Typography } from '@mui/material';
import Mopidy from 'mopidy';
import { useEffect, useRef, useState } from 'react';
import { onEnterKey } from './lib/keys';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

type CoreListenerEvent = keyof Mopidy.core.CoreListener;

function Volume() {
  // console.log(`[Volume]`);
  const [volume, setVolume] = useState(0);
  const [exactVolume, setExactVolume] = useState(5);
  const [disabled, setDisabled] = useState(true);

  const ws = useRef<Mopidy | null>(null);

  useEffect(() => {
    if (ws.current) {
      // console.log(`ws.current:`, ws.current);
      return;
    }

    // console.log(`opening mopidy`);
    const mopidy = (ws.current = new Mopidy({ webSocketUrl: '' }));
    // console.log(`opened mopidy:`, ws.current);

    function mopidyClose() {
      ws.current = null;
      mopidy.off();
      mopidy.close();
    }

    mopidy.on('websocket:error', async (e: object | string) => {
      console.log('Something went wrong with the Mopidy connection!', e);
      mopidyClose();
    });

    mopidy.on('state:offline', async () => {
      setDisabled(true);
    });

    mopidy.on('state:online', async () => {
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      const serverVolume = await mopidy.mixer?.getVolume();
      setVolume(typeof serverVolume === 'number' ? serverVolume : 0);
      setDisabled(false);
    });

    mopidy.on('state:volumeChanged' as CoreListenerEvent, async ({ volume }: { volume: number }) => {
      // console.log(`state:volumeChanged volume = ${volume}`);
      setVolume(volume);
    });

    return () => {
      // console.log(`closing mopidy:`, mopidy);
      mopidyClose();
    };
  }, []);

  function setMopidyVolume(newVolume: number) {
    // console.log(`[setMopidyVolume] newVolume = ${newVolume}`);
    if (ws.current && newVolume >= 0 && newVolume <= 100) {
      ws.current.mixer?.setVolume({ volume: newVolume }).then(() => setVolume(newVolume));
    }
  }

  const btnStyle = { py: [3, 2] };

  return (
    <>
      {/* <Typography variant="h4" textAlign="center">
        Mopidy Volume
      </Typography> */}
      <Stack spacing={2} sx={{ justifyContent: 'center', height: '100%' }}>
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
          Up
        </Button>
        <Typography textAlign="center" sx={{ fontWeight: 'bold' }}>
          {volume}
        </Typography>
        <Button variant="outlined" size="large" sx={btnStyle} onClick={() => setMopidyVolume(volume - 1)}>
          Down
        </Button>
      </Stack>
    </>
  );
}

export default Volume;
