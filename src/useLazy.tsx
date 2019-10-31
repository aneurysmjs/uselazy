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

interface LazyObj<T> {
  /* eslint-disable @typescript-eslint/indent */
  getModule: () =>
    | Promise<{ default: T }>
    | Promise<{ default: SomeFn<T> }>
    | Array<Promise<{ default: SomeFn<T> }>>;
  /* eslint-enable @typescript-eslint/indent */
  shouldImport: boolean;
  onFynally?: () => void;
}

interface UseLazyResult<T> {
  isLoading: boolean;
  result: T | (SomeFn<T>) | Array<SomeFn<T>> | null;
}

const initialState = {
  isLoading: false,
  result: null,
};

function useLazy<T>({
  getModule,
  shouldImport = false,
  onFynally = (): void => {},
}: LazyObj<T>): UseLazyResult<T> {
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
      } finally {
        onFynally();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldImport]);

  return handleThrow(AsyncModule);
}

export default useLazy;
