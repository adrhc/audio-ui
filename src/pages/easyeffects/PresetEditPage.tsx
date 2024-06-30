import { useGoBack } from '../../hooks/useGoBack';
import { EEPreset, areEqual, newPreset, updatePreset } from '../../services/easyeffects';
import { useSustainableState } from '../../hooks/useSustainableState';
import PresetEditForm from './PresetEditForm';
import ConfirmationButtonMenu from '../../components/menu/ConfirmationButtonMenu';
import PresetPage from '../../templates/PresetPage';
import { useCallback } from 'react';
import useButtonRef from '../../hooks/useButtonRef';

const PresetEditPage = () => {
  const goBack = useGoBack();
  // const [formRef, submit] = useFormRef();
  const [submitBtnRef, submitBtnClick] = useButtonRef();
  const [state, sustain, setState] = useSustainableState<EEPreset>(newPreset());
  // console.log(`[PresetEditPage] preset:`, preset);
  // console.log(`[PresetEditPage] submitBtnRef.current:`, submitBtnRef.current);

  const handleSubmit = useCallback(() => {
    // console.log(`[handleSubmit] preset:`, preset);
    setState((old) => ({ ...old, error: '' }));
    sustain(
      updatePreset(state).then((it) => {
        if (areEqual(state, it)) {
          goBack();
        } else {
          console.error(`[PresetEditPage.handleSubmit] different on server:`, { source: state, server: it });
          return Promise.reject('The server returned a different updated value!');
        }
      }),
      { ...state, error: 'Update failed!' }
    );
  }, [goBack, setState, state, sustain]);

  return (
    <PresetPage
      {...{ state, sustain, setState }}
      bottom={<ConfirmationButtonMenu onAccept={submitBtnClick} />}
    >
      <PresetEditForm {...{ state, setState, submitBtnRef }} onSubmit={handleSubmit} />
    </PresetPage>
  );
};

export default PresetEditPage;
