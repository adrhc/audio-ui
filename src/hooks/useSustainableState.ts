import { useCallback, useState } from 'react';
import {
  Loading,
  LoadingState,
  SetFeedbackState,
  SetLoadingState,
  SustainFailState,
  SustainPromise,
  SustainUnknownFailState,
  SustainUnknownPromise,
} from '../lib/sustain/types';
import { sustain, sustainUnknown } from '../lib/sustain/sustain';

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
  (
    promise?: SustainUnknownPromise,
    failState?: SustainUnknownFailState,
    noWait?: boolean
  ) => Promise<unknown>,
  SetFeedbackState,
] {
  const [loading, setState] = useState<Loading>({});
  const sustainFn = useCallback(
    (promise?: SustainUnknownPromise, failState?: SustainUnknownFailState, noWait?: boolean) =>
      sustainUnknown(setState, promise, failState, noWait),
    []
  );
  return [loading, sustainFn, setState];
}

export type SustainVoidFn<S> = (
  promise?: SustainPromise<S>,
  failState?: SustainFailState<S>,
  noWait?: boolean
) => Promise<void>;

export function useSustainableState<S>(
  initialState: LoadingStateOrProvider<S>
): [LoadingState<S>, SustainVoidFn<S>, SetLoadingState<S>] {
  const [state, setState] = useState<LoadingState<S>>(initialState);
  const sustainFn = useCallback(
    (promise?: SustainPromise<S>, failState?: SustainFailState<S>, noWait?: boolean) =>
      sustain(setState, promise, failState, noWait),
    []
  );
  return [state, sustainFn, setState];
}
