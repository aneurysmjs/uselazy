import { DynamicImportResult, NamedImport } from '../types';

export default function handleImport<T>(importObj: DynamicImportResult<T>): T | NamedImport<T> {
  // here we know is a named import
  if (!importObj.default) {
    let namedSingleValue = {} as T;

    const keys = Object.keys(importObj);

    // is an object with a bunch of stuff, so just return it the way it is.
    if (keys.length > 1) {
      return importObj;
    }

    // there's only one key, so just grab its value.
    Object.keys(importObj).forEach((key: string) => {
      namedSingleValue = importObj[key];
    });

    // return the single value from the named import.
    return namedSingleValue;
  }
  // otherwise is a default import
  return importObj.default;
}
