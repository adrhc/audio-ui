import { SxProps, Theme } from '@mui/material';
import Mopidy from 'mopidy';

export type Undefined<T> = T | undefined;
export type NullOrUndefined<T> = T | null | undefined;

export type Styles = SxProps<Theme>;
export type NoArgsProc = () => void;
export type PlaybackState = 'playing' | 'paused' | 'stopped';

export type MopidyEvent<K extends keyof Mopidy.StrictEvents> = [K, Mopidy.StrictEvents[K]];
export type CoreListenerEvent = keyof Mopidy.core.CoreListener;
