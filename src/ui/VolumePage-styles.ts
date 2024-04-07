import { Theme } from '@mui/material';
import { zipBreakpoints } from '../lib/styles';
import { Styles } from '../lib/types';

export const TITLE: Styles = { textAlign: 'center', fontWeight: 'bold' };

export const YS = [2.5, 1.5]; // available y space

const FONT_SIZE: Record<'input' | 'icon', number[]> = {
  input: [3, 2.75],
  icon: [4.5],
};

export const BORDER = { border: 'solid thin rgba(0, 0, 0, 0.2)', borderRadius: 1 };

export function inputFontSize(theme: Theme) {
  return FONT_SIZE.input.map((v) => theme.spacing(v));
}

export function iconFontSize(theme: Theme) {
  return FONT_SIZE.icon.map((v) => theme.spacing(v));
}

export function iconFontSizeMap(fontSizeMapper: (fontSize: number[]) => number[]) {
  return (theme: Theme) => fontSizeMapper(FONT_SIZE.icon).map((v) => theme.spacing(v));
}

export function ys(theme: Theme) {
  console.log(
    'YS(theme):',
    YS.map((v) => theme.spacing(v))
  );
  return YS.map((v) => theme.spacing(v));
}

export function rowHeight(theme: Theme) {
  const breakpointValues = zipBreakpoints(FONT_SIZE.icon, YS, (ic, ys) => ic + 2 * ys);
  // console.log('breakpointValues:', breakpointValues);
  // console.log('breakpointValues(theme):', breakpointValues.map(v => theme.spacing(v));
  return breakpointValues.map((v) => theme.spacing(v));
}
