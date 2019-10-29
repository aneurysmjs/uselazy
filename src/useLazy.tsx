import { useState, useEffect } from 'react';

import handleThrow from './utils/handleThrow';

interface LazyObj<P> {
  getModule: () => Promise<{ default: () => P }> | Array<Promise<{ default: () => P | P }>>;
  shouldImport: boolean;
  onFynally?: () => void;
}

/**
 * is much better to have all in one object, that allows the arguments to come
 * in any order and if there's anyone we don't need, we can simply ignore them
 * or anything that is missing we can simply provide defaults
 */
function useLazy<P>({
  getModule,
  shouldImport = false,
  onFynally = (): void => {},
}: LazyObj<P>): (() => P) | Array<() => P> | null {
  const [AsyncModule, setAsyncModule] = useState<(() => P) | Array<() => P> | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!shouldImport) {
          return;
        }
        const module = await getModule();

        if (module instanceof Array) {
          const modules = await Promise.all(module);
          setAsyncModule(modules.map(m => m.default));
        }

        if ('default' in module) {
          setAsyncModule(() => module.default);
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
