/* eslint-disable @typescript-eslint/indent, @typescript-eslint/ban-ts-ignore */
import { renderHook } from '@testing-library/react-hooks';

import { ReactElement } from 'react';

import useLazy from '../useLazy';

// type ExampleModule = () => Promise<typeof import('./Example')>;
type ExampleModule = () => Promise<{ default: () => ReactElement }>;

const getModule: ExampleModule = () => import('./Example');

type GetModules = () => Array<Promise<{ default: () => ReactElement }>>;

const getModules: GetModules = () => [import('./Example'), import('./AnotherExample')];

describe('LazyComponent', () => {
  it('should render "null" at first and then resolve promise', async () => {
    const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
      useLazy({
        getModule,
        shouldImport: true,
      }),
    );

    expect(renderHookResult.current.isLoading).toEqual(true);
    expect(renderHookResult.current.result).toEqual(null);

    await waitForNextUpdate();

    expect(renderHookResult.current.isLoading).toEqual(false);
    expect(renderHookResult.current.result).not.toBe(undefined);
    expect(typeof renderHookResult.current.result).toBe('function');
  });

  it('should call "finally" handler when the promised is resolve', async () => {
    const handleFinally = jest.fn();
    const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
      useLazy({
        getModule,
        shouldImport: true,
        onFynally: handleFinally,
      }),
    );

    expect(renderHookResult.current.isLoading).toEqual(true);
    expect(renderHookResult.current.result).toEqual(null);

    await waitForNextUpdate();

    expect(renderHookResult.current.isLoading).toEqual(false);
    expect(renderHookResult.current.result).not.toBe(undefined);
    expect(typeof renderHookResult.current.result).toBe('function');
    expect(handleFinally).toHaveBeenCalledTimes(1);
  });

  it('should now how to handle and array of promises', async () => {
    const handleFinally = jest.fn();
    const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
      useLazy({
        getModule: getModules,
        shouldImport: true,
        onFynally: handleFinally,
      }),
    );

    expect(renderHookResult.current.isLoading).toEqual(true);
    expect(renderHookResult.current.result).toEqual(null);

    await waitForNextUpdate();

    expect(renderHookResult.current.isLoading).toEqual(false);
    expect(Array.isArray(renderHookResult.current.result)).toBe(true);
    // @ts-ignore
    expect(renderHookResult.current.result.every(f => typeof f === 'function')).toBe(true);
    expect(handleFinally).toHaveBeenCalledTimes(1);
  });

  describe('import other stuff besided React components', () => {
    it('should import a common function', async () => {
      type SomeUtil = () => Promise<{ default: (message: string, reason: string) => string }>;

      const getUtil: SomeUtil = () => import('./utilExample');

      const handleFinally = jest.fn();
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy({
          getModule: getUtil,
          shouldImport: true,
          onFynally: handleFinally,
        }),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('function');
      // @ts-ignore - avoid Object is possibly "null" since it won't be like that
      expect(renderHookResult.current.result('очень', 'круто')).toBe('очень круто');
      expect(handleFinally).toHaveBeenCalledTimes(1);
    });

    it('should import an object', async () => {
      type UtilExample = () => Promise<{ default: { name: string; hobby: string } }>;

      const getUtil: UtilExample = () => import('./objectExample');

      const handleFinally = jest.fn();
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy({
          getModule: getUtil,
          shouldImport: true,
          onFynally: handleFinally,
        }),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('object');
      expect(renderHookResult.current.result).toStrictEqual({
        name: 'Джеро',
        hobby: 'программирование',
      });
      expect(handleFinally).toHaveBeenCalledTimes(1);
    });
  });

  describe('handle exceptions', () => {
    it('should throw for a single import', async () => {
      // @ts-ignore - just to avoid Typescript's "can't find module"
      type WrongModule = typeof import('./wrong/Example');
      // @ts-ignore - just to avoid Typescript's "can't find module"
      const wrongModule = (): WrongModule => import('./wrong/Example'); // eslint-disable-line import/no-unresolved

      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy({
          getModule: wrongModule,
          shouldImport: true,
        }),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);

      await waitForNextUpdate();

      expect(() => {
        expect(renderHookResult.current.result).not.toBe(undefined);
      }).toThrow(
        Error(`useLazy Error: Cannot find module './wrong/Example' from 'useLazy.test.tsx'`),
      );

      expect(renderHookResult.error).toEqual(
        Error(`useLazy Error: Cannot find module './wrong/Example' from 'useLazy.test.tsx'`),
      );
    });

    it('should throw for multiple imports', async () => {
      type WrongModules = () => Array<
        // @ts-ignore - just to avoid Typescript's "can't find module"
        Promise<typeof import('./Example') | typeof import('./AnotherWrongModule')>
      >;

      const wrongModules: WrongModules = () => [
        import('./Example'),
        // @ts-ignore - just to avoid Typescript's "can't find module"
        import('./AnotherWrongModule'), // eslint-disable-line import/no-unresolved
      ];

      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy({
          getModule: wrongModules,
          shouldImport: true,
        }),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);

      await waitForNextUpdate();

      expect(() => {
        expect(renderHookResult.current.result).not.toBe(undefined);
      }).toThrow(
        Error(`useLazy Error: Cannot find module './AnotherWrongModule' from 'useLazy.test.tsx'`),
      );
    });
  });
});
