/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { renderHook } from '@testing-library/react-hooks';

import { ReactElement, useMemo } from 'react';

import useLazy from '../useLazy';

type ModuleType = Promise<{ default: () => ReactElement }>;

type ExampleModule = () => ModuleType;

const getModule: ExampleModule = () => import('./Example');

describe('useLazy', () => {
  describe('Default Imports', () => {
    it('should render "null" at first and then resolve promise', async () => {
      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(useMemo(() => [getModule], [])),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('function');
    });
  });

  describe('Named Imports', () => {
    it('should handle named imports', async () => {
      type NamedExampleType = typeof import('./NamedExample');
      const getNamedImport = (): Promise<NamedExampleType> => import('./NamedExample');

      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(useMemo(() => [getNamedImport], [])),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('function');
    });

    it('should import an object with Redux actions', async () => {
      interface ReduxActions {
        action1(): {
          type: string;
          payload: {
            price: number;
          };
        };
        action2(): {
          type: string;
          payload: {
            url: string;
          };
        };
      }

      const getActions = (): Promise<ReduxActions> => import('./actions');

      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(useMemo(() => [getActions], [])),
      );

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.result).toEqual(null);

      await waitForNextUpdate();

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.result).not.toBe(undefined);
      expect(typeof renderHookResult.current.result).toBe('object');
      expect(renderHookResult.current.result).toHaveProperty('action1');
      expect(renderHookResult.current.result).toHaveProperty('action2');
    });
  });

  describe('handle exceptions', () => {
    it('should throw when import failed', async () => {
      // @ts-ignore - just to avoid Typescript's "can't find module"
      type AnotherWrongModuleType = typeof import('./AnotherWrongModule');

      const wrongModules = [
        (): ModuleType => import('./Example'),
        // @ts-ignore - just to avoid Typescript's "can't find module"
        (): AnotherWrongModuleType => import('./AnotherWrongModule'), // eslint-disable-line import/no-unresolved
      ];

      const { result: renderHookResult, waitForNextUpdate } = renderHook(() =>
        useLazy(wrongModules),
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
