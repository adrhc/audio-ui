import { HistoryPosition } from '../../domain/history';
import { useRawURLQueryParams } from '../../hooks/useURLSearchParams';

export function useHistoryQueryParams(): HistoryPosition | null {
  const params = useRawURLQueryParams();
  const doc = params.get('doc');
  const shardIndex = params.get('shardIndex');
  if (doc == null) {
    return null;
  } else {
    return {
      doc: +doc,
      shardIndex: shardIndex == null ? shardIndex : +shardIndex,
      fields: params.getAll('fields').map((it) => +it),
    };
  }
}
