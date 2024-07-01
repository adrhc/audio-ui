import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import VolumeButtonsPanel from '../components/panel/VolumeButtonsPanel';
import PageTemplate from '../templates/PageTemplate';
import { useSustainableState } from '../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import { boostVolume, volumeBoost } from '../services/boost';
import { setVolume as setMopidyVolume } from '../services/mpc';
import { useGoBack } from '../hooks/useGoBack';
import { AppContext } from '../components/app/AppContext';
import ConfirmationButtonMenu from '../components/menu/ConfirmationButtonMenu';
import { SetFeedbackState } from '../lib/sustain';
import PageTitle from '../components/PageTitle';
import './AudioBoostPage.scss';

type AudioBoostPageState = { draftVolume?: number };

const AudioBoostPage = () => {
  const goBackFn = useGoBack();
  const {
    mopidy,
    currentSong,
    boost: oldBoost,
    volume,
    getBaseVolume,
    setBaseVolume,
    setBoost,
  } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableState<AudioBoostPageState>({});
  const { draftVolume } = state;

  // there's no chance for the baseVolume to be changed
  // after reading it here while still in AudioBoostPage
  const baseVolume = getBaseVolume();
  const boost = volumeBoost(baseVolume, volume, currentSong);
  /* console.log(`[AudioBoostPage] draftVolume = ${state.draftVolume}`, {
    oldBoost,
    draftBoost: boost?.boost,
  }); */

  const onVolumeChange = useCallback(
    (draftVolume: number) => {
      console.log(`[AudioBoostPage:onVolumeChange] draftVolume = ${draftVolume}`);
      sustain(
        setMopidyVolume(mopidy, draftVolume)?.then(() => ({ draftVolume })),
        `Can't change the volume to ${draftVolume}!`,
        true
      );
    },
    [mopidy, sustain]
  );

  const goBack = useCallback(() => {
    draftVolume != null && setBaseVolume(draftVolume - (oldBoost ?? 0));
    goBackFn();
  }, [goBackFn, setBaseVolume, oldBoost, draftVolume]);

  const saveBoost = useCallback(() => {
    if (boost == null) {
      setState((old) => ({ ...old, error: "Can't determine the boost to use!" }));
      return;
    }
    // console.log(`[AudioBoostPage] boost:`, boost);
    sustain(
      boostVolume(boost).then(() => {
        // App:useEffect:boostAwareVolume effect will update the Mopidy volume
        // which otherwise will be out of sync if draftVolume != undefined
        setBoost(boost);
        goBackFn();
      }),
      'Failed to save!'
    );
  }, [boost, goBackFn, setBoost, setState, sustain]);

  return (
    <PageTemplate
      className="audio-boost-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideContent={boost == null}
      title={
        <PageTitle>
          Boost from {baseVolume}
          <br />
          {boost?.title}
        </PageTitle>
      }
      bottom={<ConfirmationButtonMenu goBack={goBack} onAccept={saveBoost} />}
    >
      <ExactVolumePanel values={[0, 5, 10, 15, 20]} onChange={onVolumeChange} />
      <ExactVolumePanel values={[25, 30, 35, 40, 45]} onChange={onVolumeChange} />
      <VolumeButtonsPanel badgeColor="secondary" volume={volume} onChange={onVolumeChange} />
      <ExactVolumePanel values={[50, 55, 60, 65, 70]} onChange={onVolumeChange} />
      <ExactVolumePanel values={[75, 80, 85, 90, 100]} onChange={onVolumeChange} />
    </PageTemplate>
  );
};

export default AudioBoostPage;
