import { useContext, useEffect, useState } from 'react';
import { PlayOptions, setConsume, setRandom, setRepeat, setSingle } from '../../lib/mpc';
import { AppContext } from '../../App';
import { getPlayOptions } from '../../lib/mpc';
import { formatErr } from '../../lib/format';
import { MopidyEvent, Styles } from '../../lib/types';
import Mopidy from 'mopidy';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import { Box, Stack, ToggleButton, Tooltip } from '@mui/material';
import { BORDER, iconFontSizeMap } from '../../pages/volume/styles';
import Spinner from '../Spinner';
import { useBreakpointValue } from '../../lib/hooks/useBreakpointValue';

type MopidyPlayOptionsState = { loading?: boolean } & PlayOptions;

const MopidyPlayOptions = () => {
  const { mopidy, online } = useContext(AppContext);
  const [state, setState] = useState<MopidyPlayOptionsState>({});
  console.log(`[MopidyPlayOptions] online = ${online}\nstate:`, state);

  function loadOptions(mopidy: Mopidy) {
    // console.log(`[MopidyPlayOptions:loadOptions]`);
    setState((old) => ({ ...old, loading: true }));
    getPlayOptions(mopidy)
      .then((options) => {
        // console.log(`[MopidyPlayOptions:loadOptions] newOptions:\n`, state);
        setState((old) => ({ ...old, loading: false, ...options }));
      })
      .catch((reason) => {
        setState((old) => ({ ...old, loading: false }));
        alert(formatErr(reason));
      });
  }

  useEffect(() => {
    console.log(`[MopidyPlayOptions:online] online = ${online}`);
    if (!online) {
      return;
    }
    loadOptions(mopidy);
  }, [mopidy, online]);

  useEffect(() => {
    console.log(`[MopidyPlayOptions:mopidy]`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push(['event:optionsChanged', () => loadOptions(mopidy)]);

    events.forEach((e) => mopidy.on(...e));

    return () => {
      console.log(`[MopidyPlayOptions:destroy]`);
      // addLog(`[MopidyPlayOptions:destroy]`);
      events.forEach((e) => mopidy.off(...e));
    };
  }, [mopidy]);

  const boxStyle = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' };
  const btnStyle = useBreakpointValue({}, { p: 0.75 });
  const iconStyle = { fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1 : 0.5))) };

  return (
    // Only Stack works with Spinner!
    <Stack sx={{ height: '100%', ...BORDER }}>
      <Spinner hide={!state.loading} />
      <Box sx={[boxStyle, state.loading ? { display: 'none' } : {}]}>
        <Tooltip title="Repeat">
          <span>
            <ToggleButton
              value="repeat"
              selected={state.repeat}
              disabled={!online}
              sx={btnStyle}
              onClick={() => setRepeat(mopidy, !state.repeat)}
            >
              <RepeatIcon sx={iconStyle} />
            </ToggleButton>
          </span>
        </Tooltip>
        <Tooltip title="Playback is stopped after current song, unless in repeat mode.">
          <span>
            <ToggleButton
              value="single"
              selected={state.single}
              disabled={!online}
              sx={btnStyle}
              onClick={() => setSingle(mopidy, !state.single)}
            >
              <TimesOneMobiledataIcon sx={iconStyle} />
            </ToggleButton>
          </span>
        </Tooltip>
        <Tooltip title="Random">
          <span>
            <ToggleButton
              value="random"
              selected={state.random}
              disabled={!online}
              sx={btnStyle}
              onClick={() => setRandom(mopidy, !state.random)}
            >
              <ShuffleIcon sx={iconStyle} />
            </ToggleButton>
          </span>
        </Tooltip>
        <Tooltip title="Tracks are removed from the tracklist when they have been played.">
          <span>
            <ToggleButton
              value="consume"
              selected={state.consume}
              disabled={!online}
              sx={btnStyle}
              onClick={() => setConsume(mopidy, !state.consume)}
            >
              <RestaurantMenuIcon sx={iconStyle} />
            </ToggleButton>
          </span>
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default MopidyPlayOptions;
