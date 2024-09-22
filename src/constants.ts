import { useSize } from './lib/theme';

export const SHOW_LOGS = false;
export function useMaxEdge() {
  return useSize(6);
}

export const MOPIDY_DISCONNECTED_ERROR = 'Mopidy is not available!';
