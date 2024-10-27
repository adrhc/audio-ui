import { EEPreset, newPreset } from '../../infrastructure/easyeffects/types';
import { useSustainableState } from '../../hooks/useSustainableState';
import PresetViewPanel from '../../components/panel/PresetViewPanel';
import EEPresetPage from '../../templates/EEPresetPage';

const PresetViewPage = () => {
  const [state, sustain, setState] = useSustainableState<EEPreset>(newPreset());

  return (
    <EEPresetPage {...{ state, sustain, setState }}>
      <PresetViewPanel preset={state} />
    </EEPresetPage>
  );
};

export default PresetViewPage;
