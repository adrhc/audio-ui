import { SxProps, Theme } from "@mui/material";
import { AllSystemCSSProperties } from '@mui/system/styleFunctionSx';

export type Styles = SxProps<Theme> & AllSystemCSSProperties;
export type NoParamsProc = () => void;
export type PlaybackState = 'playing' | 'paused' | 'stopped';
