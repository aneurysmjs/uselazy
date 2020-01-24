import isDefaultImport from './isDefaultImport';

import { DynamicImportResult, NamedImport } from '../types';

export default function handleImport<T>(importObj: DynamicImportResult<T>): T | NamedImport<T> {
  // check if in fact is a default import.
  if (isDefaultImport(importObj)) {
    return importObj.default;
  }

  // otherwise is named import.

  const keys = Object.keys(importObj);

  // is an object with a bunch of stuff, so just return it the way it is.
  if (keys.length > 1) {
    return importObj;
  }

  // otherwise is a single-keyed named import.
  let namedSingleValue = {} as T;

  // there's only one key, so just grab its value.
  Object.keys(importObj).forEach((key: string) => {
    namedSingleValue = importObj[key];
  });

  // return the single value from the named import.
  return namedSingleValue;
}
