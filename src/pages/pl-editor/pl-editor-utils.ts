import { MediaLocation } from '../../domain/media-location/utils';
import { LoadingStateOrProvider } from '../../hooks/useSustainableState';

export function toError<T>(failedToChange: MediaLocation[]): Partial<LoadingStateOrProvider<T>> {
  return { error: `Failed to change ${failedToChange.map((it) => it.title).join(',')}!` };
}
