import { Theme, useTheme } from '@mui/material';
import { useMemo } from 'react';

export function spacing(size: number, important?: boolean) {
  return (th: Theme) => (important ? `${th.spacing(size)} !important` : th.spacing(size));
}

export function useSize(size: number) {
  const theme = useTheme();
  return useMemo(() => pxCount(theme, size), [theme, size]);
}

export function pxCount(theme: Theme, size: number) {
  return +theme.spacing(size).replace(/px$/, '');
}

export function fontSize(size: number, important?: boolean) {
  return { fontSize: spacing(size, important) };
}

export function right(size: number, important?: boolean) {
  return { right: spacing(size, important) };
}
