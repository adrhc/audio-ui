import { EEPreset, newPreset } from '../../infrastructure/easyeffects/types';
import { useSustainableState } from '../../hooks/useSustainableState';
import PresetViewPanel from '../../components/panel/PresetViewPanel';
import PresetPage from '../../templates/PresetPage';

const PresetViewPage = () => {
  const [state, sustain, setState] = useSustainableState<EEPreset>(newPreset());

  return (
    <PresetPage {...{ state, sustain, setState }}>
      <PresetViewPanel preset={state} />
    </PresetPage>
  );
};

export default PresetViewPage;
