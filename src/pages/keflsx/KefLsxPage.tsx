import { Stack, Typography } from '@mui/material';
import pageStyles from '../page.module.scss';
import { KefLSXState, getState, setPower as setKefPower, setVolume } from '../../services/kef';
import { useCallback, useEffect, useState } from 'react';
import { formatErr } from '../../lib/format';
import kefctrl from '../../assets/kef-control-no-bkg.png';
import kefctrlstop from '../../assets/kef-control-stop.png';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';
import { iconFontSizeMap, panelHeight } from '../player/styles';
import Spinner from '../../components/Spinner';
import ShowIf from '../../components/ShowIf';
import ToggleImgButton from '../../components/button/ToggleImgButton';
import { useEmptyHistory } from '../../hooks/useEmptyHistory';
import { useNavigate } from 'react-router-dom';
import VolumeButtons from '../../components/panel/VolumeButtons';
import ExactVolumePanel from '../../components/panel/ExactVolumePanel';
import CornerIconButton from '../../components/button/cornerbutton/CornerIconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Styles } from '../../lib/types';
import { ifIPhone } from '../../lib/agent';

type KefLsxPageState = { loading?: boolean } & KefLSXState;

export default function KefLsxPage() {
  const emptyHistory = useEmptyHistory();
  const navigate = useNavigate();
  const [state, setState] = useState<KefLsxPageState>({ volume: 0 });
  console.log(`[KefLSXPanel] emptyHistory=${emptyHistory}, state:`, state);

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

  function goBack() {
    emptyHistory ? navigate('/player') : navigate(-1);
  }

  const btnStyle: Styles = useBreakpointValue({ p: 0.85 }, { p: 0.75 });
  const iconStyle = { fontSize: iconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 1.5 : 0.5))) };

  return (
    <>
      <Stack
        className={pageStyles.page}
        spacing={1}
        sx={[
          { position: 'relative', flexWrap: 'wrap' },
          state.power ? { '& > div:not(.corner)': { height: panelHeight }, flexWrap: 'nowrap' } : {},
        ]}
      >
        <Spinner hide={!state.loading} />
        <ShowIf condition={!state.loading}>
          <ShowIf condition={!state.power}>
            <ToggleImgButton
              sx={[btnStyle, { maxWidth: (th) => th.spacing(8), maxHeight: (th) => th.spacing(8) }]}
              iconSx={iconStyle}
              offImg={kefctrlstop}
              onImg={kefctrl}
              selected={state.power}
              onClick={() => setPower(!state.power)}
            />
          </ShowIf>
          <ShowIf condition={state.power}>
            {/* <Stack className={pageStyles.page} spacing={1}> */}
            <Typography variant="h6" className={pageStyles.title}>
              KEF LSX Volume
            </Typography>
            <ExactVolumePanel values={[5, 15, 25, 35, 45]} onChange={onVolumeChange} />
            <VolumeButtons badgeColor="secondary" volume={state.volume} handleExactVolume={onVolumeChange} />
            <ExactVolumePanel values={[55, 65, 75, 85, 95]} onChange={onVolumeChange} />
            {/* </Stack> */}
          </ShowIf>
        </ShowIf>
        <CornerIconButton
          sx={{ minHeight: (th) => th.spacing(9.5) }}
          className={ifIPhone(pageStyles.bottomCornerBtn, '')}
          onClick={goBack}
        >
          <ArrowCircleLeftIcon sx={{fontSize: 36}} />
        </CornerIconButton>
      </Stack>
    </>
  );
}
