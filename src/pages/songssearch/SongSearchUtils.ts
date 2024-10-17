import { toQueryParams } from '../../lib/path-param-utils';
import { SongSearchCache, RawSongsSearchPageState } from './model';

export function toRawSongsSearchPageState(state: SongSearchCache): RawSongsSearchPageState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchExpression, ...result } = { ...state };
  return result;
}

export function toSongsSearchParams(search: string): URLSearchParams {
  // return toQueryParams(['search', search], ['rand', `${Math.random()}`]);
  return toQueryParams(['search', search]);
}
