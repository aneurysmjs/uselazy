export default function handleThrow<P>(errorOrObj: P): P {
  if (errorOrObj) {
    // rejection from `import()` for some reason is not and instance of Error
    // that's why the "Object.getPrototypeOf(errorOrObj).name"
    if (errorOrObj instanceof Error || Object.getPrototypeOf(errorOrObj).name === 'Error') {
      throw new Error(`useLazy ${errorOrObj}`);
    }
  }
  return errorOrObj;
}
