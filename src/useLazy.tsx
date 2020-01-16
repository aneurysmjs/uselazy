import { useState, useEffect } from 'react';

import handleThrow from './utils/handleThrow';

/**
 * I've learned this here:
 * @link https://github.com/Microsoft/TypeScript/pull/24897
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SomeFn<U, V extends any[] = any[]> {
  (param: U, ...rest: V): U | V;
}

interface UseLazyResult<T> {
  isLoading: boolean;
  result: T | SomeFn<T> | Array<SomeFn<T>> | null;
}

/* eslint-disable @typescript-eslint/indent */
type GetModule<T> = () =>
  | Promise<{ default: T }>
  | Promise<{ default: SomeFn<T> }>
  | Array<Promise<{ default: SomeFn<T> }>>;
/* eslint-enable @typescript-eslint/indent */

const initialState = {
  isLoading: false,
  result: null,
};

function useLazy<T>(getModule: GetModule<T>, shouldImport = false): UseLazyResult<T> {
  const [AsyncModule, setAsyncModule] = useState<UseLazyResult<T>>(initialState);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!shouldImport) {
          return;
        }

        setAsyncModule({
          isLoading: true,
          result: null,
        });

        const module = await getModule();

        if (module instanceof Array) {
          const modules = await Promise.all(module);
          setAsyncModule({
            isLoading: false,
            result: modules.map(m => m.default),
          });
        }

        if ('default' in module) {
          setAsyncModule({
            isLoading: false,
            result: module.default,
          });
        }
      } catch (err) {
        setAsyncModule(err);
      }
    })();
  }, []);

  return handleThrow(AsyncModule);
}

export default useLazy;
