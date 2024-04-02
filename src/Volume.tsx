import { Button, Stack, Typography } from '@mui/material';
import Mopidy from 'mopidy';
import { useEffect, useRef, useState } from 'react';
import { showPlaybackInfo, showTracklistInfo } from './lib/mpc';

function Volume() {
  const [volume, setVolume] = useState<number | string>('unknown');

  const ws = useRef<Mopidy | null>(null);

  useEffect(() => {
    if (ws.current) {
      console.log(`ws.current:`, ws.current);
      return;
    }

    const mopidy = (ws.current = new Mopidy());
    console.log(`opened mopidy:`, ws.current);

    mopidy.on('state:online', async () => {
      await showPlaybackInfo(mopidy);
      await showTracklistInfo(mopidy);
      setVolume((await mopidy.mixer.getVolume()) || 'unknown');
    });

    mopidy.on('state:volumeChanged', async ({ volume }: { volume: number }) => {
      console.log(`state:volumeChanged volume = ${volume}`);
      setVolume(volume || 'unknown');
    });

    return () => {
      console.log(`closing mopidy:`, mopidy);
      ws.current = null;
      mopidy.off();
      mopidy.close();
    };
  }, []);

  function handleVolumeChange(increment: number) {
    let newVolume: number;
    if (typeof volume == 'string') {
      newVolume = Math.abs(increment);
    } else {
      newVolume = volume + increment;
      newVolume = newVolume < 0 ? 0 : newVolume;
    }
    ws.current.mixer.setVolume({ volume: newVolume }).then(() => setVolume(newVolume));
  }

  return (
    <>
      <Typography variant="h6" textAlign="center">
        Volume
      </Typography>
      <Stack>
        <Button variant="outlined" size="large" sx={{ py: 2 }} onClick={() => handleVolumeChange(1)}>
          Up
        </Button>
        <Typography variant="h6" textAlign="center">
          {volume}
        </Typography>
        <Button variant="outlined" size="large" sx={{ py: 2 }} onClick={() => handleVolumeChange(-1)}>
          Down
        </Button>
      </Stack>
    </>
  );
}

export default Volume;
