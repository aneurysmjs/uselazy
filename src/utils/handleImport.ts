import { DefaultImport } from '../types';

export default function handleImport<T>(obj?: DefaultImport<T>): T | undefined {
  return obj && obj.default;
}
