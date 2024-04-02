import { Button, Stack, Typography } from '@mui/material';
import Mopidy from 'mopidy';
import { useState } from 'react';

function Volume() {
  const [volume, setVolume] = useState(10);
  const mopidy = new Mopidy();

  return (
    <>
      <Typography variant="h6" textAlign="center">
        Volume
      </Typography>
      <Stack>
        <Button variant="outlined" size="large" sx={{ py: 2 }} onClick={() => setVolume(volume + 1)}>
          Up
        </Button>
        <Typography variant="h6" textAlign="center">
          {volume}
        </Typography>
        <Button variant="outlined" size="large" sx={{ py: 2 }} onClick={() => setVolume(volume - 1)}>
          Down
        </Button>
      </Stack>
    </>
  );
}

export default Volume;
