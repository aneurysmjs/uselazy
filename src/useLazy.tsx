import { useState, useEffect } from 'react';

import handleThrow from './utils/handleThrow';

interface LazyObj<P> {
  getModule: () => Promise<{ default: () => P }> | Array<Promise<{ default: () => P | P }>>;
  shouldImport: boolean;
  onFynally?: () => void;
}

interface UseLazyResult<P> {
  isLoading: boolean;
  result: (() => P) | Array<() => P> | null;
}

const initialState = {
  isLoading: false,
  result: null,
};

function useLazy<P>({
  getModule,
  shouldImport = false,
  onFynally = (): void => {},
}: LazyObj<P>): UseLazyResult<P> {
  const [AsyncModule, setAsyncModule] = useState<UseLazyResult<P>>(initialState);

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
