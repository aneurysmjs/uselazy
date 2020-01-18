import { useEffect, useCallback, useReducer, Reducer } from 'react';

import handleThrow from './utils/handleThrow';

import { GetModule, Action, State, FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE } from './types';

function makeReducer<T>(): Reducer<State<T>, Action<T>> {
  return (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case FETCH_INIT:
        return {
          ...state,
          isLoading: true,
        };
      case FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          result: action.payload,
        };
      case FETCH_FAILURE:
        return {
          ...state,
          isLoading: false,
          result: action.payload,
        };
      default:
        throw new Error();
    }
  };
}

const initialState = {
  isLoading: false,
  result: null,
};

function useLazy<T>(getModule: GetModule<T>, shouldImport = false): State<T> {
  // Preserves identity of "getModule" so it can be safely add as a dependency of useEffect
  const resolver = useCallback(getModule, []);

  const reducer = makeReducer<T>();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!shouldImport) {
          return;
        }
        dispatch({ type: FETCH_INIT });

        const module = await resolver();

        if (module instanceof Array) {
          const modules = await Promise.all(module);
          dispatch({ type: FETCH_SUCCESS, payload: modules.map(m => m.default) });
        }

        if ('default' in module) {
          dispatch({ type: FETCH_SUCCESS, payload: module.default });
        }
      } catch (error) {
        dispatch({ type: FETCH_FAILURE, payload: error });
      }
    })();
  }, [resolver, shouldImport]);

  return handleThrow(state);
}

export default useLazy;
