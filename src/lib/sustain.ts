import { Dispatch, SetStateAction } from 'react';
import { formatErr } from './format';

export interface Loading {
  loading?: boolean | null;
  error?: string | null;
}
export type SetFeedbackState = Dispatch<SetStateAction<Loading>>;
export type LoadingState<S> = Loading & S;
export type SetLoadingState<S> = Dispatch<SetStateAction<LoadingState<S>>>;
export type SetLoading = Dispatch<SetStateAction<Loading>>;
export type SetState<S> = Dispatch<SetStateAction<S>>;

export function removeLoadingAttributes<S>(loadingState: LoadingState<S>): S {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, ...result } = loadingState;
  return result as S;
}

export type SustainPromise<S> = Promise<Partial<LoadingState<S>> | null | undefined | void>;
export type SustainFailState<S> = Partial<LoadingState<S> | Loading> | string | null | undefined;

// export function sustain<S>(setState: Dispatch<SetStateAction<LoadingState<S>>>, promise: Promise<Partial<LoadingState<S>>>) : void;
// export function sustain<S>(setState: Dispatch<SetStateAction<LoadingState<S> | undefined>>, promise: Promise<Partial<LoadingState<S>>>) : void {
export function sustain<S>(
  setState: SetLoadingState<S>,
  promise?: SustainPromise<S>,
  failState?: SustainFailState<S>,
  noWait?: boolean
) {
  setState((old) => ({ ...old, loading: !noWait, error: '' }));
  return handleState(setState, promise, failState);
}

function handleState<S>(
  setState: SetLoadingState<S>,
  promise: SustainPromise<S> = Promise.resolve({}),
  failState?: SustainFailState<S>
) {
  return promise
    .then((newState) =>
      setState((old) => {
        // console.log(`[App.handleState]`, { old, newState });
        return { ...old, ...newState, loading: false };
      })
    )
    .catch((reason) => {
      console.error(reason);
      setState((old) => ({ ...old, loading: false, ...toStateError(reason, failState) }));
      /* if (failState == null) {
        alert(formatErr(reason));
      } */
    });
}

export type SustainUnknownPromise = Promise<Partial<LoadingState<unknown> | Loading> | void>;
export type SustainUnknownFailState = Partial<LoadingState<unknown> | Loading> | string | null | undefined;

export function sustainUnknown(
  setState: SetLoading,
  promise?: SustainUnknownPromise,
  failState?: SustainUnknownFailState,
  noWait?: boolean
) {
  setState({ loading: !noWait });
  return handleUnknownState(setState, promise, failState);
}

function handleUnknownState(
  setState: SetLoading,
  promise: SustainUnknownPromise = Promise.resolve(),
  failState?: SustainUnknownFailState
) {
  return promise
    .then((it) => setState((old) => ({ ...old, ...it, loading: false })))
    .catch((reason) => {
      console.error(reason);
      // console.error(`[handleLoadingUnknownError]`, { loading: false, ...toStateError(reason, failState) });
      setState({ loading: false, ...toStateError(reason, failState) });
      // alert(formatErr(reason));
    });
}

function toStateError<S>(
  reason: unknown,
  failState?: SustainUnknownFailState
): Partial<LoadingState<S> | Loading> | null {
  if (failState == null) {
    if (typeof reason === 'string') {
      return { error: reason };
    } else {
      return { error: formatErr(reason as object) };
    }
  } else if (typeof failState === 'string') {
    return { error: failState };
  } else {
    return failState;
  }
}
