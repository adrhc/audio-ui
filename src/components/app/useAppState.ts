import Mopidy from 'mopidy';
import { useCallback } from 'react';
import { VolumeBoost } from '../../services/boost';
import { SustainVoidFn, useSustainableState } from '../../hooks/useSustainableState';
import { LoadingState, SetLoadingState } from '../../lib/sustain';
import { NoArgsProc } from '../../domain/types';
import { PlaybackState } from '../../domain/types';
import { AlertColor } from '@mui/material';
import { useURLQueryParams } from '../../hooks/useURLSearchParams';
import { Credentials, credentialsOf } from '../../domain/credentials';
import { TrackSong } from '../../domain/track-song';

export const DEFAULT_APP_STATE_WTHOUT_MOPIDY = {
  online: false,
  volume: 0,
  boost: 0,
  mute: false,
  logs: [],
  user: '',
  password: '',
};

export type AppState = {
  mopidy?: Mopidy;
  online: boolean;
  pbStatus?: PlaybackState;
  currentSong?: TrackSong;
  streamTitle?: string | null;
  volume: number;
  boost: number;
  mute: boolean;
  logs: string[];
  notification?: string | null;
  severity?: AlertColor;
  credentials: Credentials;
};

export type SetNotificationFn = (notification?: string | null) => void;
export type SetCredentialsFn = (credentials: Credentials) => void;

export default function useAppState(): [
  LoadingState<AppState>,
  SustainVoidFn<AppState>,
  SetLoadingState<AppState>,
  (vb: VolumeBoost) => void,
  NoArgsProc,
  SetNotificationFn,
  SetCredentialsFn,
] {
  const credentials = credentialsOf(useURLQueryParams('user', 'password'));
  // console.log(`[useAppState] credentials (incomplete = ${credentials.isIncomplete()}):`, credentials);
  const [state, sustain, setState] = useSustainableState<AppState>(() => newAppState(credentials));

  const setBoost = useCallback(
    (vb: VolumeBoost) => {
      setState((old) => {
        if (old.currentSong?.uri == vb.uri) {
          console.log(`[useAppState:setBoost] setting volume boost to:`, vb);
          return { ...old, boost: vb.boost };
        } else {
          console.error(`[useAppState:setBoost] boost uri doesn't match song uri!`, {
            currentState: old,
            volumeBoost: vb,
          });
          return old;
        }
      });
    },
    [setState]
  );

  const clearNotification = useCallback(
    () => setState((old) => ({ ...old, notification: null })),
    [setState]
  );

  const setNotification = useCallback(
    (notification?: string | null) => setState((old) => ({ ...old, notification })),
    [setState]
  );

  const setCredentials = useCallback(
    (credentials: Credentials) => setState((old) => ({ ...old, credentials })),
    [setState]
  );

  return [state, sustain, setState, setBoost, clearNotification, setNotification, setCredentials];
}

export function newAppState(credentials: Credentials): AppState {
  /* if (isLocalAdrhc()) {
    console.log(`[newAppState] connecting to local Mopidy`);
    // const webSocket = new WebSocket('', ['Authorization', 'your_token_here']);
    // const base64encodedData = Buffer.from(`${username}:${password}`).toString('base64');
    // return DEFAULT_APP_STATE_WTHOUT_MOPIDY;
    return { ...DEFAULT_APP_STATE_WTHOUT_MOPIDY, credentials, mopidy: new Mopidy({ webSocketUrl: '' }) };
  } else {
    console.log(`[newAppState] Mopidy connection won't be created`);
    return { ...DEFAULT_APP_STATE_WTHOUT_MOPIDY, credentials };
  } */
  return { ...DEFAULT_APP_STATE_WTHOUT_MOPIDY, credentials };
}
