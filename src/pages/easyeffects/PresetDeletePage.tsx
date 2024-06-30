import { useGoBack } from '../../hooks/useGoBack';
import { EEPreset, newPreset, removePreset } from '../../services/easyeffects';
import { useSustainableState } from '../../hooks/useSustainableState';
import PresetViewPanel from '../../components/panel/PresetViewPanel';
import ConfirmationButtonMenu from '../../components/menu/ConfirmationButtonMenu';
import PresetPage from '../../templates/PresetPage';

type UpdateError = { error?: string };
type PresetDeletePageState = EEPreset & UpdateError;

const PresetDeletePage = () => {
  const goBack = useGoBack();
  const [state, sustain, setState] = useSustainableState<PresetDeletePageState>(newPreset());

  function handleDelete() {
    // console.log(`[handleDelete] preset:`, preset);
    sustain(
      removePreset(state.name).then(() => {
        goBack();
      }),
      'Remove failed!'
    );
  }

  return (
    <PresetPage {...{ state, sustain, setState }} bottom={<ConfirmationButtonMenu onAccept={handleDelete} />}>
      <PresetViewPanel preset={state} />
    </PresetPage>
  );
};

export default PresetDeletePage;
