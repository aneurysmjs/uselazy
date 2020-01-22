import { useEffect, useReducer, Reducer } from 'react';

import handleThrow from './utils/handleThrow';
import handleImport from './utils/handleImport';

import { ImportFn, Action, State, IMPORT_INIT, IMPORT_SUCCESS, IMPORT_FAILURE } from './types';

const initialState = {
  isLoading: false,
  result: null,
};

function makeReducer<T>(): Reducer<State<T>, Action<T>> {
  return (state: State<T> = initialState, action: Action<T>): State<T> => {
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

function useLazy<T>(importFns: Array<ImportFn<T>>, shouldImport = false): State<T> {
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
          // when there's more than one element, set and array, otherwise, just pluck the single element
          payload: modules.length > 1 ? modules.map(handleImport) : handleImport(modules.pop()),
        });
      } catch (error) {
        dispatch({ type: IMPORT_FAILURE, payload: error });
      }
    })();
  }, [importFns, shouldImport]);

  return handleThrow(state);
}

export default useLazy;
