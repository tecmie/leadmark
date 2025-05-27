import { UniqueFilenameOptions } from '@repo/types';
import * as xxhashjs from 'xxhashjs';

export function uniqueFilename({ filename }: UniqueFilenameOptions): string {
  const hash = xxhashjs.h32(filename, 0xabcdef).toString(16);

  return `${hash}_tulip_${filename}`;
}
