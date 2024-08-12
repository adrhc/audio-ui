import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import VolumeButtonsPanel from '../components/panel/VolumeButtonsPanel';
import PageTemplate from '../templates/PageTemplate';
import { useSustainableState } from '../hooks/useSustainableState';
import { useCallback, useContext, useEffect } from 'react';
import { boostVolume, volumeBoost } from '../services/boost';
import { setVolume as setMopidyVolume, truncateVolume } from '../services/mpc';
import { useGoBack } from '../hooks/useGoBack';
import { AppContext } from '../components/app/AppContext';
import ConfirmationButtonMenu from '../components/menu/ConfirmationButtonMenu';
import { SetFeedbackState } from '../lib/sustain';
import PageTitle from '../components/PageTitle';
import './AudioBoostPage.scss';

type AudioBoostPageState = { draftVolume?: number };

const AudioBoostPage = () => {
  const goBack = useGoBack();
  const { mopidy, currentSong, boost: oldBoost, volume, getBaseVolume, setBoost } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<AudioBoostPageState>({});
  const { draftVolume = volume } = state;
  const baseVolume = getBaseVolume();
  console.log(
    `[AudioBoostPage] baseVolume = ${baseVolume ?? 'unknown'}, oldBoost=${oldBoost}, volume=${volume}, draftVolume = ${draftVolume}`
  );

  // there's no chance for the baseVolume to be changed
  // after reading it here while still in AudioBoostPage
  // whilst oldBoost remains unchanged till setBoost(boost)
  // is invoked, boost does change when volume changes
  const boost = volumeBoost(baseVolume, volume, currentSong);
  /* console.log(`[AudioBoostPage] draftVolume = ${state.draftVolume}`, {
    oldBoost,
    draftBoost: boost?.boost,
  }); */

  const setVolume = useCallback(
    (newDraftVolume: number) => {
      console.log(`[AudioBoostPage:setVolume] draftVolume = ${newDraftVolume} (truncated to [0,100])`);
      sustain(
        setMopidyVolume(mopidy, newDraftVolume)?.then(() => ({ draftVolume: newDraftVolume })),
        `Can't change the volume to ${newDraftVolume}!`,
        true
      );
    },
    [mopidy, sustain]
  );

  const saveBoost = useCallback(() => {
    if (boost == null) {
      setState((old) => ({ ...old, error: "Can't determine the boost to use!" }));
      return;
    }
    sustain(
      boostVolume(boost).then(() => {
        console.log(`[AudioBoostPage] boost = ${boost.boost}, title = ${boost.title}`);
        // App:useEffect:boostAwareVolume effect will update the Mopidy volume
        // which otherwise will be out of sync if draftVolume != undefined
        setBoost(boost);
        goBack();
      }),
      'Failed to save!'
    );
  }, [boost, goBack, setBoost, setState, sustain]);

  return (
    <PageTemplate
      className="audio-boost-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideContent={boost == null}
      title={
        <PageTitle>
          {boost?.title}
          <br />
          (unamplified volume is {baseVolume})
        </PageTitle>
      }
      bottom={<ConfirmationButtonMenu goBack={goBack} onAccept={saveBoost} />}
    >
      <ExactVolumePanel values={[0, 5, 10, 15, 20]} onChange={setVolume} />
      <ExactVolumePanel values={[25, 30, 35, 40, 45]} onChange={setVolume} />
      <VolumeButtonsPanel
        badgeColor="secondary"
        volume={draftVolume}
        onIncrement={(increment) => setVolume(truncateVolume(volume + increment))}
        useVolumeForBadge={true}
      />
      <ExactVolumePanel values={[50, 55, 60, 65, 70]} onChange={setVolume} />
      <ExactVolumePanel values={[75, 80, 85, 90, 100]} onChange={setVolume} />
    </PageTemplate>
  );
};

export default AudioBoostPage;
