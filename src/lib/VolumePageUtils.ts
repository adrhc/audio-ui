import { useMediaQuery } from '@mui/material';

export const MIN_PlaybackPanel_WIDTH = '320px';

export function useMobile<T>(t: T, otherwise?: T | null | undefined): T | null | undefined {
  return useMediaQuery(`(min-width:${MIN_PlaybackPanel_WIDTH})`, { noSsr: true }) ? t : otherwise;
}
