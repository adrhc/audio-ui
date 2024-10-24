import { useCallback, useContext, useEffect } from 'react';
import { setConsume, setRandom, setRepeat, setSingle } from '../../datasource/mpc/mpc';
import { getPlayOptions } from '../../datasource/mpc/mpc';
import { MopidyEvent } from '../../domain/types';
import Mopidy from 'mopidy';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import { ButtonGroup, ToggleButton } from '@mui/material';
import { iconFontSize } from '../../pages/styles';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';
import SpinnerPannel from './SpinnerPannel';
import { LoadingState } from '../../lib/sustain';
import { AppContext } from '../../hooks/AppContext';
import { useSustainableState } from '../../hooks/useSustainableState';
import { PlayOptions } from '../../datasource/mpc/types';
import './MopidyPlayOptions.scss';

type MopidyPlayOptionsState = LoadingState<PlayOptions>;

const MopidyPlayOptions = () => {
  const { mopidy, online } = useContext(AppContext);
  const [state, sustain] = useSustainableState<MopidyPlayOptionsState>({});
  // console.log(`[MopidyPlayOptions] online = ${online}, state:`, state);

  const loadOptions = useCallback(
    (mopidy?: Mopidy) => {
      console.log(`[MopidyPlayOptions] loading the player options`);
      sustain(getPlayOptions(mopidy), 'Failed to load the player options!');
    },
    [sustain]
  );

  useEffect(() => {
    // console.log(`[MopidyPlayOptions:online] online = ${online}`);
    online && loadOptions(mopidy);
  }, [loadOptions, mopidy, online]);

  useEffect(() => {
    // console.log(`[MopidyPlayOptions:mopidy]`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push(['event:optionsChanged', () => loadOptions(mopidy)]);

    events.forEach((e) => mopidy?.on(...e));

    return () => {
      // console.log(`[MopidyPlayOptions:destroy]`);
      // addLog(`[MopidyPlayOptions:destroy]`);
      events.forEach((e) => mopidy?.off(...e));
    };
  }, [loadOptions, mopidy]);

  const btnStyle = useBreakpointValue({ p: 1.1 }, { p: 0.75 });
  const iconStyle = { fontSize: iconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 1 : 0.5))) };

  return (
    <ButtonGroup className="mopidy-play-options" disabled={!online}>
      <SpinnerPannel show={state.loading} />
      <ToggleButton
        value="repeat"
        selected={state.repeat}
        sx={btnStyle}
        aria-label="Repeat"
        onClick={() => setRepeat(mopidy, !state.repeat)}
      >
        <RepeatIcon sx={iconStyle} />
      </ToggleButton>
      <ToggleButton
        value="single"
        selected={state.single}
        sx={btnStyle}
        aria-label="Playback is stopped after current song, unless in repeat mode."
        onClick={() => setSingle(mopidy, !state.single)}
      >
        <TimesOneMobiledataIcon sx={iconStyle} />
      </ToggleButton>
      <ToggleButton
        value="random"
        selected={state.random}
        sx={btnStyle}
        aria-label="Random"
        onClick={() => setRandom(mopidy, !state.random)}
      >
        <ShuffleIcon sx={iconStyle} />
      </ToggleButton>
      <ToggleButton
        value="consume"
        selected={state.consume}
        sx={btnStyle}
        aria-label="Tracks are removed from the tracklist when they have been played."
        onClick={() => setConsume(mopidy, !state.consume)}
      >
        <RestaurantMenuIcon sx={iconStyle} />
      </ToggleButton>
    </ButtonGroup>
  );
};

export default MopidyPlayOptions;
