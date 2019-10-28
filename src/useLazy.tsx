import { useState, useEffect } from 'react';

import handleThrow from './utils/handleThrow';

type GetModuleType<P> = () => Promise<{ default: () => P }> | Array<Promise<{ default: () => P }>>;

function useLazy<P>(
  getModule: GetModuleType<P>,
  cond = false,
  onFynally: () => void = (): void => {},
): (() => P) | Array<() => P> | null {
  const [AsyncModule, setAsyncModule] = useState<(() => P) | Array<() => P> | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!cond) {
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
  }, [cond]);

  return handleThrow(AsyncModule);
}

export default useLazy;
