import { Theme } from '@mui/material';
import { zipBreakpoints } from '../../lib/styles';

export const PANEL_YS = [2.5, 2.5]; // available y space

const FONT_SIZE: Record<'input' | 'icon', number[]> = {
  input: [3, 2.75],
  icon: [4.5, 4.5],
};

const PLAY_FONT_SIZE = [5.5, 5.5];

export function inputFontSize(theme: Theme) {
  return FONT_SIZE.input.map((v) => theme.spacing(v));
}

export function iconFontSize(theme: Theme) {
  return FONT_SIZE.icon.map((v) => theme.spacing(v));
}

export function iconFontSizeMap(sizeMapper: (fontSize: number[]) => number[]) {
  return (theme: Theme) => sizeMapper(FONT_SIZE.icon).map((v) => theme.spacing(v));
}

export function playIconFontSize(theme: Theme) {
  return PLAY_FONT_SIZE.map((v) => theme.spacing(v));
}

export function playIconFontSizeMap(sizeMapper: (fontSize: number[]) => number[]) {
  return (theme: Theme) => sizeMapper(PLAY_FONT_SIZE).map((v) => theme.spacing(v));
}

export function panelYSpace(theme: Theme) {
  /* console.log(
    'panelYSpace(theme):',
    YS.map((v) => theme.spacing(v))
  ); */
  return PANEL_YS.map((v) => theme.spacing(v));
}

/**
 * @returns FONT_SIZE + 2 * PANEL_YS
 */
export function panelHeight(theme: Theme) {
  const breakpointValues = zipBreakpoints(FONT_SIZE.icon, PANEL_YS, (ic, ys) => ic + 2 * ys);
  // console.log('breakpointValues:', breakpointValues);
  // console.log('breakpointValues(theme):', breakpointValues.map(v => theme.spacing(v));
  return breakpointValues.map((v) => theme.spacing(v));
}
