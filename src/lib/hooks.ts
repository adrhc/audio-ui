import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { valueAtIndexOrLast } from './array';

export function useBreakpointValue<T>(breakpointValues: T[]): T {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  if (isXl) {
    return valueAtIndexOrLast(breakpointValues, 4);
  } else if (isLg) {
    return valueAtIndexOrLast(breakpointValues, 3);
  } else if (isMd) {
    return valueAtIndexOrLast(breakpointValues, 2);
  } else if (isSm) {
    return valueAtIndexOrLast(breakpointValues, 1);
  } else {
    return valueAtIndexOrLast(breakpointValues, 0);
  }
}
