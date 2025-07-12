import ExactVolumePanel from '../components/panel/ExactVolumePanel';
import VolumeButtonsPanel from '../components/panel/VolumeButtonsPanel';
import PageTemplate from '../templates/PageTemplate';
import { useSustainableState } from '../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import { boostVolume } from '../infrastructure/audio-ws/boost/boost';
import { setVolume as setMopidyVolume } from '../infrastructure/mopidy/mpc/player';
import { useGoBack } from '../hooks/useGoBack';
import { AppContext } from '../hooks/AppContext';
import ConfirmationButtonMenu from '../components/menu/ConfirmationButtonMenu';
import { SetFeedbackState } from '../lib/sustain/types';
import PageTitle from '../components/page-title/PageTitle';
import { toVolumeBoost } from '../infrastructure/audio-ws/boost/types';
import './AudioBoostPage.scss';
import { truncateVolume } from '../domain/utils';

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
  
  // console.log(`[AudioBoostPage] currentSong:`, currentSong);
  // console.log(`[AudioBoostPage] oldBoost=${oldBoost}, volume=${volume}, draftVolume = ${draftVolume}`);

  // there's no chance for the baseVolume to be changed
  // after reading it here while still in AudioBoostPage
  const baseVolume = getBaseVolume();
  // whilst oldBoost remains unchanged till setBoost(boost)
  // is invoked, "boost" does change when "volume" changes
  const draftBoost = toVolumeBoost(baseVolume, draftVolume, currentSong);
  /* console.log(
    `[AudioBoostPage] baseVolume = ${baseVolume ?? 'undefined'}, draftBoost = ${draftBoost?.boost}`
  ); */

  const setVolume = useCallback(
    (newDraftVolume: number) => {
      // console.log(`[AudioBoostPage.setVolume] newDraftVolume = ${newDraftVolume} (truncated to [0,100])`);
      sustain(
        // see also App:event:volumeChanged (i.e. "volume" is updated too)
        setMopidyVolume(mopidy, newDraftVolume)?.then(() => ({ draftVolume: newDraftVolume })),
        `Can't change the volume to ${newDraftVolume}!`,
        true
      );
    },
    [mopidy, sustain]
  );

  const goBack = useCallback(() => {
    /* console.log(
      `[AudioBoostPage.goBack] oldBoost = ${oldBoost}, draftVolume = ${draftVolume ?? 'undefined'}`
    ); */
    // the audio boost remains unchanged but the base (aka, flat) one does change
    !!draftVolume && setBaseVolume(draftVolume - (oldBoost ?? 0));
    goBackFn();
  }, [goBackFn, setBaseVolume, oldBoost, draftVolume]);

  const saveBoost = useCallback(() => {
    if (draftBoost == null) {
      // console.log(`[AudioBoostPage.saveBoost] draftBoost didn't change!`);
      goBackFn();
      return;
    }
    sustain(
      boostVolume(draftBoost).then(() => {
        setBoost(draftBoost);
        goBackFn();
      }),
      'Failed to save!'
    );
  }, [draftBoost, goBackFn, setBoost, sustain]);

  const disabled = !currentSong?.uri;
  return (
    <PageTemplate
      className="audio-boost-page"
      state={state}
      setState={setState as SetFeedbackState}
      title={
        <PageTitle>
          {currentSong?.title} {!!currentSong?.title && <br />} (flat volume is {baseVolume})
        </PageTitle>
      }
      bottom={<ConfirmationButtonMenu goBack={goBack} onAccept={saveBoost} acceptDisabled={disabled} />}
    >
      <ExactVolumePanel values={[0, 5, 10, 15, 20]} onChange={setVolume} disabled={disabled} />
      <ExactVolumePanel values={[25, 30, 35, 40, 45]} onChange={setVolume} disabled={disabled} />
      <VolumeButtonsPanel
        badgeColor="secondary"
        volume={volume}
        onIncrement={(increment) => setVolume(truncateVolume(volume + increment))}
        disabled={disabled}
      />
      <ExactVolumePanel values={[50, 55, 60, 65, 70]} onChange={setVolume} disabled={disabled} />
      <ExactVolumePanel values={[75, 80, 85, 90, 100]} onChange={setVolume} disabled={disabled} />
    </PageTemplate>
  );
};

export default AudioBoostPage;
