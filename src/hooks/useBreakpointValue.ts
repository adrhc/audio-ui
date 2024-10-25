import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { fillWithLastElem, getValueAtIndexOrLast } from '../lib/array';

export function useSpaceEvenly() {
  return useBreakpointValue('center', 'space-evenly');
}

export function useBreakpointValue<T>(...breakpointValues: T[]): T {
  breakpointValues = fillWithLastElem(breakpointValues, 3);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('tablet'), { noSsr: true });
  const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'), { noSsr: true });
  if (isDesktop) {
    // console.log(`[useBreakpointValue] isDesktop: true`);
    return getValueAtIndexOrLast(breakpointValues, 2); // desktop
  } else if (isTablet) {
    // console.log(`[useBreakpointValue] isTablet: true`);
    return getValueAtIndexOrLast(breakpointValues, 1); // tablet
  } else {
    // console.log(`[useBreakpointValue] isMobile: true`);
    return getValueAtIndexOrLast(breakpointValues, 0); // mobile
  }
}
