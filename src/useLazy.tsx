import { useEffect, useReducer, Reducer } from 'react';

import handleThrow from './utils/handleThrow';
import handleImport from './utils/handleImport';

import {
  ImportFn,
  Action,
  UseLazyResult,
  IMPORT_INIT,
  IMPORT_SUCCESS,
  IMPORT_FAILURE,
} from './types';

const initialState = {
  isLoading: false,
  result: null,
};

function makeReducer<T>(): Reducer<UseLazyResult<T>, Action<T>> {
  return (state: UseLazyResult<T> = initialState, action: Action<T>): UseLazyResult<T> => {
    switch (action.type) {
      case IMPORT_INIT:
        return {
          ...state,
          isLoading: true,
        };
      case IMPORT_SUCCESS:
        return {
          ...state,
          isLoading: false,
          result: action.payload,
        };
      case IMPORT_FAILURE:
        return {
          ...state,
          isLoading: false,
          result: action.payload,
        };
      default:
        return state;
    }
  };
}

/**
 * `useLazy` lets you handle `lazy-loading` assets in React by taking and array of functions
 * that returns a promise from dynamic imports and predidate that decides when to execute
 * the import
 */
function useLazy<T>(importFns: Array<ImportFn<T>>, shouldImport = true): UseLazyResult<T> {
  const reducer = makeReducer<T>();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!shouldImport) {
          return;
        }
        dispatch({ type: IMPORT_INIT });
        // call each dynamic import inside `importFns` and resolve each promise
        const modules = await Promise.all(importFns.map(i => i()));

        dispatch({
          type: IMPORT_SUCCESS,
          payload: modules.map(handleImport),
        });
      } catch (error) {
        dispatch({ type: IMPORT_FAILURE, payload: error });
      }
    })();
  }, [importFns, shouldImport]);

  return handleThrow(state);
}

export default useLazy;
