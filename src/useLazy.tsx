import { useState, useEffect } from 'react';

function useLazy<P>(
  getModule: () => Promise<{ default: () => P }>,
  cond = false,
  onFynally: () => void = (): void => {},
): (() => P) | null {
  const [AsyncModule, setAsyncModule] = useState<(() => P) | null>(null);

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
      } finally {
        onFynally();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cond]);

  return AsyncModule;
}

export default useLazy;
