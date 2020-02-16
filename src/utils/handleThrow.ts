import { UseLazyResult } from '../types';

export default function handleThrow<P>(errorOrObj: UseLazyResult<P>): UseLazyResult<P> {
  if (errorOrObj.result) {
    // rejection from `import()` for some reason is not and instance of Error
    // that's why the "Object.getPrototypeOf(errorOrObj).name"
    if (
      errorOrObj.result instanceof Error ||
      Object.getPrototypeOf(errorOrObj.result).name === 'Error'
    ) {
      throw new Error(`useLazy ${errorOrObj.result}`);
    }
  }
  return errorOrObj;
}
