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
  const state = { ...loadingState };
  delete state.loading;
  delete state.error;
  return state;
}

// export function sustain<S>(setState: Dispatch<SetStateAction<LoadingState<S>>>, promise: Promise<Partial<LoadingState<S>>>) : void;
// export function sustain<S>(setState: Dispatch<SetStateAction<LoadingState<S> | undefined>>, promise: Promise<Partial<LoadingState<S>>>) : void {
export function sustain<S>(
  setState: SetLoadingState<S>,
  promise?: Promise<Partial<S> | null | undefined | void>,
  failState?: Partial<LoadingState<S>> | string | null,
  noWait?: boolean
) {
  setState((old) => ({ ...old, loading: !noWait, error: '' }));
  return handleState(setState, promise, failState);
}

function handleState<S>(
  setState: SetLoadingState<S>,
  promise: Promise<Partial<S> | null | undefined | void> = Promise.resolve({}),
  failState?: Partial<LoadingState<S>> | string | null
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

export function sustainUnknown(
  setState: SetLoading,
  promise?: Promise<unknown>,
  errorMessage?: string,
  noWait?: boolean
) {
  setState({ loading: !noWait });
  return handleUnknownState(setState, promise, errorMessage);
}

function handleUnknownState(
  setState: SetLoading,
  promise: Promise<unknown> = Promise.resolve(),
  errorMessage?: string
) {
  return promise
    .then(() => setState((old) => ({ ...old, loading: false })))
    .catch((reason) => {
      console.error(reason);
      // console.error(`[handleLoadingUnknownError]`, { loading: false, ...toStateError(reason, errorMessage) });
      setState({ loading: false, ...toStateError(reason, errorMessage) });
      // alert(formatErr(reason));
    });
}

function toStateError<S>(
  reason: unknown,
  failState?: Partial<LoadingState<S>> | string | null
): Partial<LoadingState<S>> | Loading | null {
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
