/**
 * This function extracts a specific key from an array of objects.
 *
 * @param {Array} array - Array of objects to be searched.
 * @param {Array} keys - Array of keys to be looked up.
 *
 * @returns {Array} - Array of matched key-value pairs.
 *
 * @example
 * // Example array of headers
 * let headers = [
 *   { "Name": "message-ID", "Value": "<CAJM9gr3OUx74EoPia22Q6sjeQCrURfJDx+FLo4OZAVxNAQADMQ@mail.gmail.com>" },
 *   { "Name": "In-Reply_To", "Value": "<CAJM9gr0Hd=y9+Ge=Ypop2dv=y6DewrXjsUc6YS6EmNmzhhopzw@mail.gmail.com>" },
 *   { "Name": "X-Google-Smtp-Source", "Value": "ACHHUZ6PHTd4AzeU8exwoCEQN3F8aiQrnfXwPGNL1rvxyCtMY5I65dT1qIYe8koDyU00hQBiWkvLgP5fuR42ymAXQNE=" },
 *   { "Name": "MIME-Version", "Value": "1.0" }
 * ];
 *
 * // Example keys to look up, notice the variation in casing and use of hyphen/underscore
 * let keys = ['Message-ID', 'in_reply_to'];
 *
 * console.log(findKeyValue(headers, keys));
 *
 * // Output:
 * [
 *   { "Name": "message-ID", "Value": "<CAJM9gr3OUx74EoPia22Q6sjeQCrURfJDx+FLo4OZAVxNAQADMQ@mail.gmail.com>" },
 *   { "Name": "In-Reply_To", "Value": "<CAJM9gr0Hd=y9+Ge=Ypop2dv=y6DewrXjsUc6YS6EmNmzhhopzw@mail.gmail.com>" }
 * ]
 */
export function findHeaderKeyValue(array: any[], keys: string[]) {
  const output = [];
  const noUnderscoreHyphenKeys = keys.map((key) => key.toLowerCase().replace(/[-_]/g, ''));

  for (const item of array) {
    const normalizedItemName = item.Name.toLowerCase().replace(/[-_]/g, '');
    if (noUnderscoreHyphenKeys.includes(normalizedItemName)) {
      output.push(item);
    }
  }

  return output;
}

/**
 * This function receives an array of header objects and a list of keys.
 * It looks for objects in the headers array that have a Name property matching any key in the keys list.
 * The match is case-insensitive and ignores non-alphanumeric characters.
 *
 * @param {Array<{ Name: string, Value: string }>} headers - An array of header objects.
 * @param {string[]} keys - An array of keys to look for in the headers.
 * @returns {{[key: string]: string}} - An object with the matching headers.
 *
 * @example
 * let headers = [
 *    { "Name": "X-Gm-Message-State", "Value": "value" },
 *    { "Name": "Message-ID", "Value": "id_value" },
 *    { "Name": "In-Reply-To", "Value": "reply_value" },
 * ];
 * let keys = ["Message-ID", "In-Reply-To"];
 * console.log(findHeaders(headers, keys)); // Output: { "Message-ID": "id_value", "In-Reply-To": "reply_value" }
 */
export function findHeaders(headers: { Name: string; Value: string }[], keys: string[]) {
  const result: Record<string, any> = {};

  const normalizedKey = keys.map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, ''));
  headers.forEach((header) => {
    const normalizedHeaderName = header.Name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey.includes(normalizedHeaderName)) {
      result[header.Name] = header.Value;
    }
  });

  return result;
}
