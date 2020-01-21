export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

interface DefaultImport<T> {
  default: T;
}

export interface GetModule<T> {
  (): Promise<DefaultImport<T>> | Array<Promise<DefaultImport<T>>>;
}

export type Result<T> = T | Array<T> | null | Error;

export interface State<T> {
  isLoading: boolean;
  result: Result<T>;
}

export type Action<T> =
  | { readonly type: typeof FETCH_INIT }
  | { readonly type: typeof FETCH_SUCCESS; payload: Result<T> }
  | { readonly type: typeof FETCH_FAILURE; payload: Result<T> };
