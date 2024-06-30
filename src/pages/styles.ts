import { Theme } from '@mui/material';
import { zipDiffSizesWith } from '../lib/array';

const PANEL_YS = [2.5, 2.5]; // available y space
const INPUT_FONT_SIZE = [3, 2.75];
const ICON_FONT_SIZE = [4.5, 4.5];
const PLAY_FONT_SIZE = [5.5, 5.5];

export function inputFontSize(sizeMapper: (fontSize: number[]) => number[] = (it) => it) {
  return (theme: Theme) => sizeMapper(INPUT_FONT_SIZE).map((v) => theme.spacing(v));
}

export function iconFontSize(sizeMapper: (fontSize: number[]) => number[] = (it) => it) {
  return (theme: Theme) => sizeMapper(ICON_FONT_SIZE).map((v) => theme.spacing(v));
}

export function playIconFontSize(sizeMapper: (fontSize: number[]) => number[] = (it) => it) {
  return (theme: Theme) => sizeMapper(PLAY_FONT_SIZE).map((v) => theme.spacing(v));
}

export function panelYSpace(sizeMapper: (ys: number[]) => number[] = (it) => it) {
  return (theme: Theme) => sizeMapper(PANEL_YS).map((v) => theme.spacing(v));
}

/**
 * @param factor defaults to 1
 * @returns FONT_SIZE + 2 * PANEL_YS
 */
export function panelHeight(...factor: number[]) {
  // console.log('[panelHeight] factor:', factor);
  const factors = factor.length ? factor : [1];
  // console.log('[panelHeight] factors:', factors);
  return (theme: Theme) =>
    zipDiffSizesWith(panelBreakpointValues(), factors, (bp, f) => bp * f).map((v) => theme.spacing(v));
}

export function panelHeightWith(multiplier: number, ...factor: number[]) {
  const factors = factor.length ? factor : [1];
  return panelHeight(...factors.map((it) => it * multiplier));
}

function panelBreakpointValues() {
  return zipDiffSizesWith(ICON_FONT_SIZE, PANEL_YS, (ic, ys) => ic + 2 * ys);
}
