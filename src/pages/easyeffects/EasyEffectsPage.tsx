import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import ShowIf from '../../components/ShowIf';
import { getLastUsed, getPresets, loadPreset } from '../../services/easyeffects';
import _ from 'lodash';
import { useSustainableState } from '../../hooks/useSustainableState';
import { useNavigate } from 'react-router-dom';
import PresetsList from './PresetsList';
import PageTemplate from '../../templates/PageTemplate';
import './EasyEffectsPage.scss';
import { SetFeedbackState } from '../../lib/sustain';

type EasyEffectsState = {
  current?: string;
  error?: string;
  presets: string[];
};

export default function EasyEffectsPage() {
  const navigate = useNavigate();
  const [state, sustain, setState] = useSustainableState<EasyEffectsState>({ presets: [] });

  useEffect(() => {
    sustain(
      Promise.all([getPresets(), getLastUsed()]).then(([ps, current]) => ({
        current,
        presets: _.sortBy(ps.output),
      })),
      'Load failed!'
    );
  }, [sustain]);

  const handleDelete = useCallback(
    (preset: string) => {
      console.log(`[handleDelete] preset:`, preset);
      navigate(`delete/${preset}`);
    },
    [navigate]
  );

  const handleSelection = useCallback(
    (preset: string) => {
      sustain(loadPreset(preset).then((current) => ({ current })));
    },
    [sustain]
  );

  const handleEdit = useCallback(
    (preset: string) => {
      console.log(`[handleEdit] preset:`, preset);
      navigate(preset);
    },
    [navigate]
  );

  const handleView = useCallback(
    (preset: string) => {
      console.log(`[handleView] preset:`, preset);
      navigate(`view/${preset}`);
    },
    [navigate]
  );

  return (
    <PageTemplate
      className="easy-effects-page"
      state={state}
      setState={setState as SetFeedbackState}
      title="EasyEffects presets"
      hideTop={true}
    >
      <ShowIf condition={!state.error && !state.presets.length}>
        <Typography variant="h6" className="title">
          {!state.presets.length ? 'No presets found!' : ''}
        </Typography>
      </ShowIf>
      <ShowIf condition={!!state.presets.length}>
        <Stack className="effects-wrapper">
          <PresetsList
            sx={{ flexGrow: 1 }}
            current={state.current}
            presets={state.presets}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelection={handleSelection}
          />
        </Stack>
      </ShowIf>
    </PageTemplate>
  );
}
