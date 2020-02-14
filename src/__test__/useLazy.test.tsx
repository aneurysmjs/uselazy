/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { renderHook } from '@testing-library/react-hooks';

import { ReactElement, useMemo } from 'react';

import Example from './Example';
import { NamedExample } from './NamedExample';
import * as actions from './actions';

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

      expect(Array.isArray(renderHookResult.current.result)).toBe(true);

      expect(renderHookResult.current.result).toEqual(expect.arrayContaining([Example]));
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

      expect(Array.isArray(renderHookResult.current.result)).toBe(true);

      expect(renderHookResult.current.result).toEqual(expect.arrayContaining([NamedExample]));
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

      expect(Array.isArray(renderHookResult.current.result)).toBe(true);

      expect(renderHookResult.current.result).toEqual(expect.arrayContaining([actions]));

      expect(renderHookResult.current.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action1: actions.action1,
            action2: actions.action2,
          }),
        ]),
      );
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
