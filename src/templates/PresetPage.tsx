import { ReactNode, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { LoadingState, SetFeedbackState, SetLoadingState } from '../lib/sustain';
import { EEPreset } from '../infrastructure/easyeffects/types';
import { getPreset } from '../infrastructure/easyeffects/easyeffects';
import { SustainVoidFn } from '../hooks/useSustainableState';
import { useParams } from 'react-router-dom';

export interface PresetState {
  name: string;
}

interface PresetPageParam {
  state: LoadingState<EEPreset>;
  sustain: SustainVoidFn<EEPreset>;
  setState: SetLoadingState<EEPreset>;
  bottom?: ReactNode;
  children: ReactNode;
}

function PresetPage({ state, sustain, setState, bottom, children }: PresetPageParam) {
  const { preset } = useParams();

  useEffect(() => {
    // console.log(`[PresetEditPage.useEffect] preset:`, preset);
    preset && sustain(getPreset(preset), { error: 'Load failed!' });
  }, [preset, sustain]);

  return (
    <PageTemplate
      state={state}
      setState={setState as SetFeedbackState}
      title={`Preset: ${state.name}`}
      bottom={bottom}
    >
      {children}
    </PageTemplate>
  );
}

export default PresetPage;
