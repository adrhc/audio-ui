import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { valueAtIndexOrLast } from './array';
import { useLocation } from 'react-router-dom';

export function useSpaceEvenly() {
  return useMediaQuery(`(min-width:475px)`, { noSsr: true }) ? 'space-evenly' : 'center';
}

export function useSmDown<T>(t: T, otherwise?: T | null | undefined): T | null | undefined {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true }) ? t : otherwise;
}

export function useBreakpointValue<T>(breakpointValues: T[]): T {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'), { noSsr: true });
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
