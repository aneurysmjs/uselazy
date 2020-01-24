/**
 * Action type when a promise starts `resolving`.
 */
export const IMPORT_INIT = 'IMPORT_INIT';
/**
 * Action type when a promise is `fulfilled`.
 */
export const IMPORT_SUCCESS = 'IMPORT_SUCCESS';
/**
 * Action type when a promise is `rejected`.
 */
export const IMPORT_FAILURE = 'IMPORT_FAILURE';

/**
 * Well, it is a `default` import.
 */
export interface DefaultImport<T> {
  default: T;
}

/**
 * Here a NamedImport consist of one or multiple keys.
 */
export type NamedImport<T> = { [K in keyof T]: T[K] };

/**
 * The result from a dynamic import could be a `default` import or a `named` import.
 */
export type DynamicImportResult<T> = DefaultImport<T> | NamedImport<T>;

/**
 * The import function returns a promise from a dynamic import.
 */
export interface ImportFn<T> {
  (): Promise<DynamicImportResult<T>>;
}

/**
 * This are all the possible values `useLazy` handles.
 * */
export type Result<T> = T | Array<T> | NamedImport<T> | Array<NamedImport<T>> | null | Error;

/**
 * This is the state that `useLazy` uses and returns when dealing with dynamic imports.
 */
export interface State<T> {
  isLoading: boolean;
  result: Result<T>;
}

/**
 * Every action for every step when a dynamic import is transiti.
 */
export type Action<T> =
  | { readonly type: typeof IMPORT_INIT }
  | { readonly type: typeof IMPORT_SUCCESS; payload: Result<T> }
  | { readonly type: typeof IMPORT_FAILURE; payload: Result<T> };
