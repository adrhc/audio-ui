import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Mopidy from 'mopidy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { onEnterKey } from './lib/keys';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { debounce } from 'lodash';

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

  useEffect(() => {
    if (debouncedSliderVolume == null) {
      console.warn(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}, mopidyRef = false`);
      return;
    } else if (mopidyRef.current == null) {
      console.error(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}, mopidyRef = true`);
      return;
    }
    setVolume(debouncedSliderVolume);
    // console.log(`[mopidy] debouncedSliderVolume = ${debouncedSliderVolume}`);
    mopidyRef.current.mixer?.setVolume({ volume: debouncedSliderVolume });
  }, [debouncedSliderVolume]);

  const setDebouncedSliderVolumeFn = useCallback(debounce(setDebouncedSliderVolume, 300), []);

  function handleSliderVolume(newSliderVolume: number) {
    // console.log(`[handleSliderVolume] newSliderVolume = ${newSliderVolume}`);
    if (mopidyRef.current) {
      setSliderVolume(newSliderVolume);
      setDebouncedSliderVolumeFn(newSliderVolume);
    } else {
      console.error(
        `[handleSliderVolume] rand = ${rand}, newSliderVolume = ${newSliderVolume}, mopidyRef = ${!!mopidyRef.current}`
      );
    }
  }

  function handleExactVolume(newExactVolume: number) {
    // console.log(`[handleExactVolume] newExactVolume = ${newExactVolume}`);
    if (mopidyRef.current && newExactVolume >= 0 && newExactVolume <= 100) {
      setVolume(newExactVolume);
      setSliderVolume(newExactVolume);
      // console.log(`[mopidy] newExactVolume = ${newExactVolume}`);
      mopidyRef.current.mixer?.setVolume({ volume: newExactVolume });
      // .then((b) => console.log(`[handleExactVolume] rand = ${rand}, newExactVolume = ${newExactVolume}, ok = ${b}`));
    } else {
      console.error(
        `[handleExactVolume] rand = ${rand}, newExactVolume = ${newExactVolume}, mopidyRef = ${!!mopidyRef.current}`
      );
    }
  }

  function refresh() {
    setRand(Math.random());
  }

  const btnStyle = { py: [3, 2] };

  return (
    <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ height: '100%', justifyContent: 'center', width: '100%', maxWidth: '300px' }}>
        {/* <Link to="." reloadDocument={true} state={{}}> */}
        <Button variant="outlined" size="large" sx={btnStyle} onClick={refresh}>
          <AutorenewIcon />
        </Button>
        {/* </Link> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: 'solid thin rgba(0, 0, 0, 0.2)',
            borderRadius: 1,
          }}
        >
          <InputBase
            fullWidth
            disabled={disabled}
            type="number"
            value={exactVolume}
            onChange={(e) => setExactVolume(+e.target.value)}
            onKeyUp={(e) => onEnterKey(() => handleExactVolume(exactVolume), e)}
            inputProps={{ min: 0, max: 100, style: { fontWeight: 'bold', paddingLeft: 14 } }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <EqualizerIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <Button
            disabled={disabled}
            variant="text"
            size="large"
            sx={btnStyle}
            onClick={() => handleExactVolume(exactVolume)}
          >
            Set
          </Button>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <VolumeDown />
          <Slider
            disabled={disabled}
            aria-label="Volume"
            value={sliderVolume || 0}
            onChange={(_e, newValue) => handleSliderVolume(newValue as number)}
          />
          <VolumeUp />
        </Stack>
        <Typography textAlign="center" sx={{ fontWeight: 'bold', mt: '8px !important' }}>
          {volume}
        </Typography>
        <ButtonGroup>
          <Button
            disabled={disabled}
            variant="outlined"
            size="large"
            sx={{ ...btnStyle, flexGrow: 1 }}
            onClick={() => handleExactVolume(volume - 1)}
          >
            <RemoveCircleIcon />
          </Button>
          {/* <Chip label={volume} sx={{px: 0.5, mx: 1}}/> */}
          <Button
            disabled={disabled}
            variant="outlined"
            size="large"
            sx={{ ...btnStyle, flexGrow: 1 }}
            onClick={() => handleExactVolume(volume + 1)}
          >
            <AddCircleIcon />
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}

export default Volume;
