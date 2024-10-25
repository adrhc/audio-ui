import { Dispatch, SetStateAction } from 'react';

export interface Loading {
  loading?: boolean | null;
  error?: string | null;
}
export type SetFeedbackState = Dispatch<SetStateAction<Loading>>;
export type LoadingState<S> = Loading & S;
export type SetLoadingState<S> = Dispatch<SetStateAction<LoadingState<S>>>;
export type SetLoading = Dispatch<SetStateAction<Loading>>;
export type SetState<S> = Dispatch<SetStateAction<S>>;

export type SustainPromise<S> = Promise<Partial<LoadingState<S>> | null | undefined | void>;
export type SustainFailState<S> = Partial<LoadingState<S> | Loading> | string | null | undefined;

export type SustainUnknownPromise = Promise<Partial<LoadingState<unknown> | Loading> | void>;
export type SustainUnknownFailState = Partial<LoadingState<unknown> | Loading> | string | null | undefined;
