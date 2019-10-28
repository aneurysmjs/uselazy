/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { renderHook } from '@testing-library/react-hooks';

import useLazy from '../useLazy';

type ExampleModule = () => Promise<typeof import('./Example')>;

type GetModules = () => Array<
  Promise<typeof import('./Example') | typeof import('./AnotherExample')>
>;
const getModule: ExampleModule = () => import('./Example');
const getModules: GetModules = () => [import('./Example'), import('./AnotherExample')];

describe('LazyComponent', () => {
  it('should render "null" at first and then resolve promise', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLazy(getModule, true));
    expect(result.current).toEqual(null);

    await waitForNextUpdate();

    expect(result.current).not.toBe(undefined);
    expect(typeof result.current).toBe('function');
  });

  it('should call "finally" handler when the promised is resolve', async () => {
    const handleFinally = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() => useLazy(getModule, true, handleFinally));
    expect(result.current).toEqual(null);

    await waitForNextUpdate();

    expect(result.current).not.toBe(undefined);
    expect(typeof result.current).toBe('function');
    expect(handleFinally).toHaveBeenCalledTimes(1);
  });

  it('should now how to handle and array of promises', async () => {
    const handleFinally = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      // @ts-ignore
      useLazy(getModules, true, handleFinally),
    );
    expect(result.current).toEqual(null);

    await waitForNextUpdate();

    expect(Array.isArray(result.current)).toBe(true);
    // @ts-ignore
    expect(result.current.every(f => typeof f === 'function')).toBe(true);
    expect(handleFinally).toHaveBeenCalledTimes(1);
  });

  it('should throw', async () => {
    // @ts-ignore - just for testing purposes
    type WrongModule = typeof import('./wrong/Example');
    // @ts-ignore - just for testing purposes
    const wrongModule = (): WrongModule => import('./wrong/Example'); // eslint-disable-line import/no-unresolved

    const { result, waitForNextUpdate } = renderHook(() => useLazy(wrongModule, true));

    await waitForNextUpdate();

    expect(() => {
      expect(result.current).not.toBe(undefined);
    }).toThrow(
      Error(`useLazy Error: Cannot find module './wrong/Example' from 'useLazy.test.tsx'`),
    );
  });
});
