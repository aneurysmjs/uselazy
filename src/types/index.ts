export const IMPORT_INIT = 'IMPORT_INIT';
export const IMPORT_SUCCESS = 'IMPORT_SUCCESS';
export const IMPORT_FAILURE = 'IMPORT_FAILURE';

export interface DefaultImport<T> {
  default: T;
}

export interface ImportFn<T> {
  (): Promise<DefaultImport<T>>;
}
// union type with `null` cuz' is the defaults
// and `undefined` cuz' it's something that might be returned from `Array.prototype.pop`
// when there's a single element on the modules array, so Typescript gets mad about it.
export type Result<T> = T | Array<T | undefined> | null | Error | undefined;

export interface State<T> {
  isLoading: boolean;
  result: Result<T>;
}

export type Action<T> =
  | { readonly type: typeof IMPORT_INIT }
  | { readonly type: typeof IMPORT_SUCCESS; payload: Result<T> }
  | { readonly type: typeof IMPORT_FAILURE; payload: Result<T> };
