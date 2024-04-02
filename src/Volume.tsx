import { Button, InputAdornment, Slider, Stack, TextField, Typography } from '@mui/material';
import Mopidy from 'mopidy';
import { useEffect, useRef, useState } from 'react';
import { onEnterKey } from './lib/keys';
import DirectionsIcon from '@mui/icons-material/Directions';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

type CoreListenerEvent = keyof Mopidy.core.CoreListener;

function Volume() {
  // console.log(`[Volume]`);
  const [volume, setVolume] = useState(0);
  const [exactVolume, setExactVolume] = useState<number>(5);

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

    mopidy.on('websocket:error', async (e: object | string | null | undefined) => {
      alert(`Something went wrong with the Mopidy connection!\n${e}`);
      mopidyClose();
    });

    mopidy.on('state:online', async () => {
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      const serverVolume = await mopidy.mixer?.getVolume();
      setVolume(typeof serverVolume === 'number' ? serverVolume : 0);
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

  return (
    <>
      <Typography variant="h4" textAlign="center">
        Mopidy Volume
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider
          aria-label="Volume"
          value={volume || 0}
          onChange={(_e, newValue) => setMopidyVolume(newValue as number)}
        />
        <VolumeUp />
      </Stack>
      <Stack sx={{ pt: [2, 1] }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ py: [4, 2] }}
          onClick={() => setMopidyVolume(volume + 1)}
        >
          Up
        </Button>
        <Typography variant="h6" textAlign="center" sx={{ py: [2, 1] }}>
          {volume}
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{ py: [4, 2] }}
          onClick={() => setMopidyVolume(volume - 1)}
        >
          Down
        </Button>
        <TextField
          type="number"
          label="set the exact volume"
          sx={{ mt: [4, 2] }}
          value={exactVolume}
          onChange={(e) => setExactVolume(+e.target.value)}
          onKeyUp={(e) => onEnterKey(() => setMopidyVolume(exactVolume), e)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <DirectionsIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </>
  );
}

export default Volume;
