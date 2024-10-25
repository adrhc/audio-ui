import { KefLSXState, getState, setPower as setKefPower, setVolume as setKefVolume } from '../infrastructure/kef';
import { useCallback, useEffect } from 'react';
import kefctrlstop from '../assets/kef-control-stop.png';
import ShowIf from '../components/ShowIf';
import VolumeButtonsPanel from '../components/panel/VolumeButtonsPanel';
import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import PageTemplate from '../templates/PageTemplate';
import { useSustainableState } from '../hooks/useSustainableState';
import { Button, Icon, Stack } from '@mui/material';
import { SetFeedbackState } from '../lib/sustain/types';
import KefLsxButtonMenu from '../components/menu/KefLsxButtonMenu';
import './KefLsxPage.scss';
import { truncateVolume } from '../domain/utils';

export default function KefLsxPage() {
  const [state, sustain, setState] = useSustainableState<KefLSXState>({ volume: 0 });
  console.log(`[KefLsxPage] state:`, state);

  useEffect(() => {
    sustain(
      getState().then((it) => it ?? { error: "Can't load the KEF LSX status!" }),
      "Can't load the KEF LSX status!"
    );
  }, [sustain]);

  function setPower(power: boolean) {
    sustain(setKefPower(power), "Can't update the KEF LSX status!");
  }

  function onVolumeChange(volume: number) {
    console.log(`[KefLsxPage:onVolumeChange] newVolume = ${volume}`);
    // setKefVolume's return is used by "sustain" to set state.volume 
    sustain(setKefVolume(volume), "Can't change the volume!");
  }

  const onIncrement = useCallback(
    (increment: number) => {
      const newVolume = truncateVolume(state.volume + increment);
      console.log(`[KefLsxPage:onIncrement] newVolume = ${newVolume}, increment = ${increment}`);
      sustain(setKefVolume(newVolume), "Can't change the KEF LSX volume!");
    },
    [state.volume, sustain]
  );

  return (
    <PageTemplate
      className={`kefl-lsx-page power-${state.power ? 'on' : 'off'}`}
      state={state}
      setState={setState as SetFeedbackState}
      title="KEF LSX Volume"
      bottom={<KefLsxButtonMenu showStop={state.power} onStop={() => setPower(false)} />}
    >
      <ShowIf condition={!state.power}>
        <Stack className="ignored kef-btn-wrapper" direction="row">
          <Button className="kef-btn" onClick={() => setPower(true)}>
            <Icon>
              <img src={kefctrlstop} />
            </Icon>
          </Button>
        </Stack>
      </ShowIf>
      <ShowIf condition={state.power}>
        <ExactVolumePanel values={[0, 5, 10, 15, 20]} onChange={onVolumeChange} />
        <ExactVolumePanel values={[25, 30, 35, 40, 45]} onChange={onVolumeChange} />
        <VolumeButtonsPanel badgeColor="secondary" volume={state.volume} onIncrement={onIncrement} />
        <ExactVolumePanel values={[50, 55, 60, 65, 70]} onChange={onVolumeChange} />
        <ExactVolumePanel values={[75, 80, 85, 90, 100]} onChange={onVolumeChange} />
      </ShowIf>
    </PageTemplate>
  );
}
