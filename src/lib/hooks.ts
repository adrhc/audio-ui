import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { fillWithLastElem, valueAtIndexOrLast } from './array';
import { useLocation } from 'react-router-dom';

export function useSpaceEvenly() {
  return useBreakpointValue('center', 'space-evenly');
}

export function useBreakpointValue<T>(...breakpointValues: T[]): T {
  breakpointValues = fillWithLastElem(breakpointValues, 3);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('tablet'), { noSsr: true });
  const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'), { noSsr: true });
  if (isDesktop) {
    return valueAtIndexOrLast(breakpointValues, 2); // desktop
  } else if (isTablet) {
    return valueAtIndexOrLast(breakpointValues, 1); // tablet
  } else {
    return valueAtIndexOrLast(breakpointValues, 0); // mobile
  }
}

export function useEmptyHistory() {
  const location = useLocation();
  return location.key === 'default';
}
