import { useLocation } from 'react-router-dom';

export function useRawURLQueryParams(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

export function useURLQueryParams(...paramName: string[]): Record<string, string | null> {
  const params = new URLSearchParams(useLocation().search);
  return paramName.map((name) => ({ [name]: params.get(name) })).reduce((p, acc) => ({ ...acc, ...p }), {});
}
