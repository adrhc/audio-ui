import { toQueryParams } from '../../lib/url-search-params';

export function removeSearchExpression<S>(o: { searchExpression?: string }): S {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchExpression, ...result } = o;
  return result as S;
}

export function toSongsSearchParams(search: string): URLSearchParams {
  // return toQueryParams(['search', search], ['rand', `${Math.random()}`]);
  return toQueryParams(['search', search]);
}
