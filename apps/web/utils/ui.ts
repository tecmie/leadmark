import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



/**
 * Generate an Abritrary pastel tone color based on input text.
 * @param {string} str - The string to convert.
 * @param {number} s - The saturation percentage (default is 30).
 * @param {number} l - The lightness percentage (default is 80).
 * @returns {string} The HSL color string.
 */
export function stringToHslColor(str: string, s=30, l=80) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return 'hsl('+h+', '+s+'%, '+l+'%)';
}

/**
 * Converts a string to an RGB color.
 * @param {string} str - The string to convert.
 * @returns {string} The RGB color string.
 */
function stringToRGB(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  return `rgb(${r}, ${g}, ${b})`;
}