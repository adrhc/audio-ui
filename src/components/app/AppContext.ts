import { createContext } from 'react';
import { VolumeBoost } from '../../services/boost';
import { CacheOperations } from '../../hooks/useCache';
import {
  AppState,
  DEFAULT_APP_STATE_WTHOUT_MOPIDY,
  SetCredentialsFn,
  SetNotificationFn,
} from './useAppState';
import { Credentials } from '../../domain/credentials';

type AppContextValue = AppState &
  CacheOperations & {
    getBaseVolume: () => number | null | undefined;
    setBaseVolume: (baseVolume: number) => void;
    incrementBaseVolume: (increment: number) => void;
    setBoost: (vb: VolumeBoost) => void;
    setNotification: SetNotificationFn;
    reloadState: () => void;
    setCredentials: SetCredentialsFn;
  };

export const AppContext = createContext<AppContextValue>({
  getBaseVolume: () => undefined,
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
