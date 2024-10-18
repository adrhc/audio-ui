import { Theme } from '@mui/material';

export function spacing(size: number, important?: boolean) {
  return (th: Theme) => (important ? `${th.spacing(size)} !important` : th.spacing(size));
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
