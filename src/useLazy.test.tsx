import { renderHook } from '@testing-library/react-hooks';

import useLazy from './useLazy';

type DynamicModule = () => Promise<typeof import('./Example')>;

const getModule: DynamicModule = () => import('./Example');

describe('LazyComponent', () => {
  it('should render "null" at first and then resolve promise', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLazy(getModule, true));
    expect(result.current).toEqual(null);

    await waitForNextUpdate();

    expect(result.current).not.toBe(undefined);
    expect(typeof result.current).toBe('function');
  });
});
