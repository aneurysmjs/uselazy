import { useState, useEffect, ReactElement } from 'react';

/**
 * @link https://stackoverflow.com/questions/52112948/whats-the-return-type-of-a-dynamic-import
 */
type DynamicImport = () => Promise<{ default: () => ReactElement }>;

const useLazy = (getModule: DynamicImport, cond = false): (() => ReactElement) | null => {
  const [AsyncModule, setAsyncModule] = useState<(() => ReactElement) | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!cond) {
          return;
        }
        const module = await getModule();
        setAsyncModule(() => module.default);
      } catch (err) {
        throw new Error(`useLazy error: ${err}`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cond]);

  return AsyncModule;
};

export default useLazy;
