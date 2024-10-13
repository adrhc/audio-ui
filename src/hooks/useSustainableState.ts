import { useCallback, useState } from 'react';
import {
  Loading,
  LoadingState,
  SetFeedbackState,
  SetLoadingState,
  sustain,
  sustainUnknown,
} from '../lib/sustain';

export type LoadingStateOrProvider<S> = LoadingState<S> | (() => LoadingState<S>);

/*
export function useSustainableState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  (promise: Promise<Partial<S>>) => void,
];

export function useSustainableState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, (promise: Promise<Partial<S>>) => void];
*/

export function useSustainableUnknownState(): [
  Loading,
  (promise?: Promise<Partial<LoadingState<unknown>>>, errorMessage?: string, noWait?: boolean) => Promise<unknown>,
  SetFeedbackState,
] {
  const [loading, setState] = useState<Loading>({});
  const sustainFn = useCallback(
    (promise?: Promise<Partial<LoadingState<unknown>>>, errorMessage?: string, noWait?: boolean) =>
      sustainUnknown(setState, promise, errorMessage, noWait),
    []
  );
  return [loading, sustainFn, setState];
}

export type SustainVoidFn<S> = (
  promise?: Promise<Partial<LoadingState<S>> | null | undefined | void>,
  failState?: Partial<LoadingState<S>> | string | null,
  noWait?: boolean
) => Promise<void>;

export function useSustainableState<S>(
  initialState: LoadingStateOrProvider<S>
): [LoadingState<S>, SustainVoidFn<S>, SetLoadingState<S>] {
  const [state, setState] = useState<LoadingState<S>>(initialState);
  const sustainFn = useCallback(
    (
      promise?: Promise<Partial<LoadingState<S>> | null | undefined | void>,
      failState?: Partial<LoadingState<S>> | string | null,
      noWait?: boolean
    ) => sustain(setState, promise, failState, noWait),
    []
  );
  return [state, sustainFn, setState];
}
