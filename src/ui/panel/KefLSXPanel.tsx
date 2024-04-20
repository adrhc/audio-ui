import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { iconFontSizeMap } from '../../pages/volume/styles';
import { formatErr } from '../../lib/format';
import kefctrl from '../../assets/kef-control-no-bkg.png';
import kefctrlstop from '../../assets/kef-control-stop.png';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';
import { KefLSXState, getState, setPower as setKefPower, setVolume } from '../../lib/kef';
import ToggleImgButton from '../button/ToggleImgButton';
import VolumeButtons from './VolumeButtons';
import ShowIf from '../ShowIf';
import SpinnerPannel from './SpinnerPannel';

type KefLSXPanelState = { loading?: boolean } & KefLSXState;

const KefLSXPanel = () => {
  const [state, setState] = useState<KefLSXPanelState>({ volume: 0 });
  console.log(`[KefLSXPanel] state:`, state);

  const loadStateFn = useCallback(loadState, []);

  useEffect(() => {
    loadStateFn();
  }, [loadStateFn]);

  function loadState() {
    setState((old) => ({ ...old, loading: true }));
    handleServerState(getState());
  }

  function setPower(power: boolean) {
    setState((old) => ({ ...old, loading: true }));
    handleServerState(setKefPower(power));
  }

  function handleServerState(response: Promise<KefLSXState>) {
    response
      .then((s) => setState((old) => ({ ...old, ...s, loading: false })))
      .catch((reason) => {
        setState((old) => ({ ...old, loading: false }));
        alert(formatErr(reason));
      });
  }

  function onVolumeChange(volume: number) {
    console.log(`[KefLSXPanel:onVolumeChange] newVolume = ${volume}`);
    setState((old) => ({ ...old, loading: true }));
    handleServerState(setVolume(volume));
  }

  const btnStyle = useBreakpointValue({ p: 0.85 }, { p: 0.75 });
  const iconStyle = { fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1.5 : 0.5))) };

  return (
    // Only < /> or Stack works with Spinner!
    <>
      <SpinnerPannel loading={state.loading} />
      <ShowIf condition={!state.loading && !state.power}>
        <Stack direction="row" className="panel">
          <ToggleImgButton
            sx={btnStyle}
            iconSx={iconStyle}
            offImg={kefctrlstop}
            onImg={kefctrl}
            selected={state.power}
            onClick={() => setPower(!state.power)}
          />
        </Stack>
      </ShowIf>
      <ShowIf condition={!state.loading && state.power}>
        <VolumeButtons showVolume={true} volume={state.volume} handleExactVolume={onVolumeChange} />
      </ShowIf>
    </>
  );
};

export default KefLSXPanel;
