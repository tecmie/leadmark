import * as xxhashjs from 'xxhashjs';

interface UniqueResourceNameParams {
  source: string;
  prefix: string;
}

interface UniqueFilenameParams {
  filename: string;
}

/**
 * @function uniqueResourceName
 *
 * @param {object} options - The options to use for generating the unique resource name.
 * @param {string} options.source - The source to use for generating the unique resource name.
 * @param {string} options.prefix - The prefix to use for the unique resource name.
 * @returns {string} The generated unique resource name.
 */
export function uniqueResourceName({ source, prefix }: UniqueResourceNameParams): string {
  /* Generate a hash for the source */
  const hash = xxhashjs.h32(source, 0xabcdef).toString(16);

  /* Combine the prefix, package name, and hash to create the unique resource name */
  const sourceName = `${prefix}_${source}_${hash}`;
  return sourceName;
}

/**
 * @function uniqueFilename
 *
 * @param {string} filename - The name of the file including its extension.
 * @returns {string} The generated unique file name.
 */
export function uniqueFilename({ filename }: UniqueFilenameParams): string {
  /* Generate a hash for the source */
  const hash = xxhashjs.h32(filename, 0xabcdef).toString(16);

  return `${hash}_tulip_${filename}`;
}

/**
 * @function fromValueHash
 * This function generates an xxHash64 hash from a given string value.
 * @param {string} value - The value to hash.
 * @returns {string} The generated xxHash64 hash of the value.
 */
export function fromValueHash(value: string): string {
  /* Generate an xxHash64 hash for the value */
  const hash = xxhashjs.h32(value, 0xabcdefff).toString(16);

  return hash;
}
