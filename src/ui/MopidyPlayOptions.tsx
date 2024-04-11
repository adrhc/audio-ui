import { useContext, useEffect, useState } from 'react';
import { PlayOptions, setConsume, setRandom, setRepeat, setSingle } from '../lib/mpc';
import { AppContext } from '../App';
import { getPlayOptions } from '../lib/mpc';
import { formatErr } from '../lib/logging';
import { MopidyEvent, Styles } from '../lib/types';
import Mopidy from 'mopidy';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import { Box, ToggleButton, Tooltip } from '@mui/material';
import { BORDER, iconFontSize } from './VolumePage-styles';
import { useSmDown } from '../lib/hooks';

const SX: Record<string, Styles> = {
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btn: {
    color: 'black',
  },
  icon: {
    fontSize: iconFontSize,
    // fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1 : 0.75))),
  },
};

const MopidyPlayOptions = () => {
  const { mopidy, online } = useContext(AppContext);
  const [options, setOptions] = useState<PlayOptions>({});
  console.log(`[MopidyPlayOptions] online = ${online}\noptions:`, options);

  function loadOptions(mopidy: Mopidy) {
    // console.log(`[MopidyPlayOptions:loadOptions]`);
    getPlayOptions(mopidy)
      .then((options) => {
        // console.log(`[MopidyPlayOptions:loadOptions] newOptions:\n`, options);
        setOptions(options);
      })
      .catch((reason) => {
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

  const btnStyle = useSmDown(SX.btn, { ...SX.btn, p: 0.25 });

  return (
    <Box sx={{ ...BORDER, ...SX.box }}>
      <Tooltip title="Repeat">
        <span>
          <ToggleButton
            value="repeat"
            selected={options.repeat}
            disabled={!online}
            sx={btnStyle}
            onClick={() => setRepeat(mopidy, !options.repeat)}
          >
            <RepeatIcon sx={SX.icon} />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Playback is stopped after current song, unless in repeat mode.">
        <span>
          <ToggleButton
            value="single"
            selected={options.single}
            disabled={!online}
            sx={btnStyle}
            onClick={() => setSingle(mopidy, !options.single)}
          >
            <TimesOneMobiledataIcon sx={SX.icon} />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Random">
        <span>
          <ToggleButton
            value="random"
            selected={options.random}
            disabled={!online}
            sx={btnStyle}
            onClick={() => setRandom(mopidy, !options.random)}
          >
            <ShuffleIcon sx={SX.icon} />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Tracks are removed from the tracklist when they have been played.">
        <span>
          <ToggleButton
            value="consume"
            selected={options.consume}
            disabled={!online}
            sx={btnStyle}
            onClick={() => setConsume(mopidy, !options.consume)}
          >
            <RestaurantMenuIcon sx={SX.icon} />
          </ToggleButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default MopidyPlayOptions;
