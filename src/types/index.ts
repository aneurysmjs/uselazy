export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export type GetModule<T> = () => Promise<{ default: T }> | Array<Promise<{ default: T }>>;

export type Result<T> = T | Array<T> | null | Error;

export interface State<T> {
  isLoading: boolean;
  result: Result<T>;
}

export type Action<T> =
  | { readonly type: typeof FETCH_INIT }
  | { readonly type: typeof FETCH_SUCCESS; payload: Result<T> }
  | { readonly type: typeof FETCH_FAILURE; payload: Result<T> };
