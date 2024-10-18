import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { pxCount } from '../lib/theme';

export function useSize(size: number) {
  const theme = useTheme();
  return useMemo(() => pxCount(theme, size), [theme, size]);
}

export function useMaxEdge() {
  return useSize(6);
}
