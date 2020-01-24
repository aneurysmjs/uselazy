import { DefaultImport } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isDefaultImport<T>(obj: any): obj is DefaultImport<T> {
  return 'default' in obj;
}
