/* eslint-disable @typescript-eslint/ban-ts-ignore */
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
    const shouldImport = true;
    const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
      useLazy(getModule, shouldImport),
    );

    expect(renderHookResult.current.isLoading).toEqual(true);
    expect(renderHookResult.current.result).toEqual(null);

    await waitForNextUpdate();

    expect(renderHookResult.current.isLoading).toEqual(false);
    expect(renderHookResult.current.result).not.toBe(undefined);
    expect(typeof renderHookResult.current.result).toBe('function');
  });

  it('should now how to handle and array of promises', async () => {
    const shouldImport = true;
    const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
      useLazy(getModules, shouldImport),
    );

    expect(renderHookResult.current.isLoading).toEqual(true);
    expect(renderHookResult.current.result).toEqual(null);

    await waitForNextUpdate();

    expect(renderHookResult.current.isLoading).toEqual(false);
    expect(Array.isArray(renderHookResult.current.result)).toBe(true);
    // @ts-ignore
    expect(renderHookResult.current.result.every(f => typeof f === 'function')).toBe(true);
  });

  describe('import other stuff besided React components', () => {
    it('should import a common function', async () => {
      type SomeUtil = () => Promise<{ default: (message: string, reason: string) => string }>;

      const getUtil: SomeUtil = () => import('./utilExample');

      const shouldImport = true;
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(getUtil, shouldImport),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('function');
      // @ts-ignore - avoid Object is possibly "null" since it won't be like that
      expect(renderHookResult.current.result('очень', 'круто')).toBe('очень круто');
    });

    it('should import an object', async () => {
      type UtilExample = () => Promise<{ default: { name: string; hobby: string } }>;

      const getUtil: UtilExample = () => import('./objectExample');

      const shouldImport = true;
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(getUtil, shouldImport),
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
    });
  });

  describe('handle exceptions', () => {
    it('should throw for a single import', async () => {
      // @ts-ignore - just to avoid Typescript's "can't find module"
      type WrongModule = typeof import('./wrong/Example');
      // @ts-ignore - just to avoid Typescript's "can't find module"
      const wrongModule = (): WrongModule => import('./wrong/Example'); // eslint-disable-line import/no-unresolved

      const shouldImport = true;
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(wrongModule, shouldImport),
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

      const shouldImport = true;
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(wrongModules, shouldImport),
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
