import { Box, Icon, Stack, ToggleButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Spinner from '../Spinner';
import { BORDER, iconFontSizeMap } from '../../pages/volume/styles';
import { formatErr } from '../../lib/format';
import kefctrl from '../../assets/kef-control-no-bkg.png';
import kefctrlstop from '../../assets/kef-control-stop.png';
import { useBreakpointValue } from '../../lib/hooks/useBreakpointValue';
import { Styles } from '../../lib/types';
import { KefLSXState, getState, setPower as setKefPower } from '../../lib/kef';
import ToggleImgButton from '../button/ToggleImgButton';

type KefLSXPanelState = { loading?: boolean } & KefLSXState;

const KefLSXPanel = () => {
  const [state, setState] = useState<KefLSXPanelState>({});
  console.log(`[KefLSXPanel] state:`, state);

  const loadStateFn = useCallback(loadState, []);

  useEffect(() => {
    loadStateFn();
  }, [loadStateFn]);

  function loadState() {
    setState((old) => ({ ...old, loading: true }));
    handleServerResponse(getState());
  }

  function setPower(power: boolean) {
    setState((old) => ({ ...old, loading: true }));
    handleServerResponse(setKefPower(power));
  }

  function handleServerResponse(response: Promise<KefLSXState>) {
    response
      .then((s) => setState((old) => ({ ...old, ...s, loading: false })))
      .catch((reason) => {
        setState((old) => ({ ...old, loading: false }));
        alert(formatErr(reason));
      });
  }

  const boxStyle = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' };
  const btnStyle = useBreakpointValue({ p: 1.124 }, { p: 0.75 });
  const iconStyle = { fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1.5 : 0.5))) };

  return (
    // Only Stack works with Spinner!
    <Stack sx={{ height: '100%', ...BORDER }}>
      <Spinner hide={!state.loading} />
      <Box sx={[boxStyle, state.loading ? { display: 'none' } : {}]}>
        <ToggleImgButton
          sx={btnStyle}
          iconSx={iconStyle}
          offImg={kefctrlstop}
          onImg={kefctrl}
          selected={state.power}
          onClick={() => setPower(!state.power)}
        />
      </Box>
    </Stack>
  );
};

export default KefLSXPanel;
