import { createContext } from 'react';
import { VolumeBoost } from '../services/audio-ws/boost/VolumeBoost';
import { UnknownCacheTypeOperations } from '../hooks/cache/useCache';
import {
  AppState,
  DEFAULT_APP_STATE_WTHOUT_MOPIDY,
  SetCredentialsFn,
  SetNotificationFn,
} from '../hooks/useAppState';
import { Credentials } from '../domain/credentials';

interface AppContextValue extends AppState, UnknownCacheTypeOperations {
  getBaseVolume: () => number | null | undefined;
  getBaseVolumeOr: (defaultIfNull: number) => number;
  setBaseVolume: (baseVolume: number) => void;
  incrementBaseVolume: (increment: number) => void;
  setBoost: (vb: VolumeBoost) => void;
  setNotification: SetNotificationFn;
  reloadState: () => void;
  setCredentials: SetCredentialsFn;
}

export const AppContext = createContext<AppContextValue>({
  getBaseVolume: () => undefined,
  getBaseVolumeOr: () => 0,
  setBaseVolume: () => {},
  incrementBaseVolume: () => {},
  setBoost: () => {},
  getCache: () => undefined,
  setCache: () => {},
  mergeCache: () => {},
  clearCache: () => {},
  cacheContains: () => false,
  setNotification: () => {},
  reloadState: () => {},
  setCredentials: () => {},
  credentials: new Credentials(),
  ...DEFAULT_APP_STATE_WTHOUT_MOPIDY,
});
