import { SxProps, Theme } from "@mui/material";

export type Styles = SxProps<Theme>;
export type NoParamsProc = () => void;
export type PlaybackState = 'playing' | 'paused' | 'stopped';
