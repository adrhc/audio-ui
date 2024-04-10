import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { valueAtIndexOrLast } from './array';
import { useLocation } from 'react-router-dom';

export function useBreakpointValue<T>(breakpointValues: T[]): T {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  if (isXlUp) {
    return valueAtIndexOrLast(breakpointValues, 4);
  } else if (isLgUp) {
    return valueAtIndexOrLast(breakpointValues, 3);
  } else if (isMdUp) {
    return valueAtIndexOrLast(breakpointValues, 2);
  } else if (isSmUp) {
    return valueAtIndexOrLast(breakpointValues, 1);
  } else {
    return valueAtIndexOrLast(breakpointValues, 0);
  }
}

export function useEmptyHistory() {
  const location = useLocation();
  return location.key === 'default';
}
