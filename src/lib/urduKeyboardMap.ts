/**
 * Comprehensive Urdu Keyboard mappings:
 * - Phonetic (CRULP / PakData / InPage Phonetic)
 * - Standard (Nastaliq / Typewriter standard layout)
 * Provides key display and reverse lookup for highlighting the next key on the visual keyboard.
 */

export interface KeyMapping {
  char: string;
  shiftChar?: string;
  code: string;
  label: string;
}

// QWERTY keyboard layout rows
export const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['space'],
];

// Urdu Phonetic Layout (Standardized CRULP / InPage)
export const URDU_PHONETIC_MAP: Record<string, { base: string; shift?: string }> = {
  '`': { base: '`', shift: '~' },
  '1': { base: '۱', shift: '!' },
  '2': { base: '۲', shift: '@' },
  '3': { base: '۳', shift: '۳' },
  '4': { base: '۴', shift: '۴' },
  '5': { base: '۵', shift: '٪' },
  '6': { base: '۶', shift: '^' },
  '7': { base: '۷', shift: '&' },
  '8': { base: '۸', shift: '*' },
  '9': { base: '۹', shift: ')' },
  '0': { base: '۰', shift: '(' },
  '-': { base: '-', shift: '_' },
  '=': { base: '=', shift: '+' },

  'q': { base: 'ق', shift: 'ط' },
  'w': { base: 'و', shift: 'ؤ' },
  'e': { base: 'ع', shift: 'ء' },
  'r': { base: 'ر', shift: 'ڑ' },
  't': { base: 'ت', shift: 'ٹ' },
  'y': { base: 'ے', shift: 'ی' },
  'u': { base: 'ء', shift: 'ئ' },
  'i': { base: 'ی', shift: 'ٰ' },
  'o': { base: 'ہ', shift: 'ۃ' },
  'p': { base: 'پ', shift: 'ُ' },
  '[': { base: ']', shift: '}' },
  ']': { base: '[', shift: '{' },
  '\\': { base: '\\', shift: '|' },

  'a': { base: 'ا', shift: 'آ' },
  's': { base: 'س', shift: 'ص' },
  'd': { base: 'د', shift: 'ڈ' },
  'f': { base: 'ف', shift: 'ف' },
  'g': { base: 'گ', shift: 'غ' },
  'h': { base: 'ح', shift: 'ھ' },
  'j': { base: 'ج', shift: 'ض' },
  'k': { base: 'ک', shift: 'خ' },
  'l': { base: 'ل', shift: 'اً' },
  ';': { base: '؛', shift: ':' },
  "'": { base: '’', shift: '"' },

  'z': { base: 'ز', shift: 'ذ' },
  'x': { base: 'ش', shift: 'ژ' },
  'c': { base: 'چ', shift: 'ث' },
  'v': { base: 'ط', shift: 'ظ' },
  'b': { base: 'ب', shift: 'ؓ' },
  'n': { base: 'ن', shift: 'ں' },
  'm': { base: 'م', shift: 'ؐ' },
  ',': { base: '،', shift: '«' },
  '.': { base: '۔', shift: '»' },
  '/': { base: '/', shift: '؟' },
  'space': { base: ' ', shift: ' ' },
};

// Urdu Standard (Nastaliq / Typewriter Standard)
export const URDU_STANDARD_MAP: Record<string, { base: string; shift?: string }> = {
  '`': { base: '`', shift: '~' },
  '1': { base: '۱', shift: '!' },
  '2': { base: '۲', shift: '@' },
  '3': { base: '۳', shift: '۳' },
  '4': { base: '۴', shift: '۴' },
  '5': { base: '۵', shift: '٪' },
  '6': { base: '۶', shift: '^' },
  '7': { base: '۷', shift: '&' },
  '8': { base: '۸', shift: '*' },
  '9': { base: '۹', shift: ')' },
  '0': { base: '۰', shift: '(' },
  '-': { base: '-', shift: '_' },
  '=': { base: '=', shift: '+' },

  'q': { base: 'ض', shift: 'ص' },
  'w': { base: 'ص', shift: 'ث' },
  'e': { base: 'ث', shift: 'ق' },
  'r': { base: 'ق', shift: 'ف' },
  't': { base: 'ف', shift: 'غ' },
  'y': { base: 'غ', shift: 'ع' },
  'u': { base: 'ع', shift: 'ہ' },
  'i': { base: 'ہ', shift: 'خ' },
  'o': { base: 'خ', shift: 'ح' },
  'p': { base: 'ح', shift: 'ج' },
  '[': { base: 'ج', shift: 'چ' },
  ']': { base: 'د', shift: 'ڈ' },
  '\\': { base: '\\', shift: '|' },

  'a': { base: 'ش', shift: 'س' },
  's': { base: 'س', shift: 'ی' },
  'd': { base: 'ی', shift: 'ب' },
  'f': { base: 'ب', shift: 'ل' },
  'g': { base: 'ل', shift: 'ا' },
  'h': { base: 'ا', shift: 'ت' },
  'j': { base: 'ت', shift: 'ن' },
  'k': { base: 'ن', shift: 'م' },
  'l': { base: 'م', shift: 'ک' },
  ';': { base: 'ک', shift: 'گ' },
  "'": { base: 'ط', shift: 'ظ' },

  'z': { base: 'ظ', shift: 'ط' },
  'x': { base: 'ط', shift: 'ز' },
  'c': { base: 'ز', shift: 'ر' },
  'v': { base: 'ر', shift: 'ذ' },
  'b': { base: 'ذ', shift: 'د' },
  'n': { base: 'د', shift: 'پ' },
  'm': { base: 'پ', shift: 'و' },
  ',': { base: '،', shift: 'و' },
  '.': { base: '۔', shift: '؟' },
  '/': { base: '/', shift: '؟' },
  'space': { base: ' ', shift: ' ' },
};

// Build reverse lookup caches for fast runtime highlighting
const reversePhoneticCache: Record<string, { key: string; shift: boolean }> = {};
const reverseStandardCache: Record<string, { key: string; shift: boolean }> = {};

for (const [key, mapping] of Object.entries(URDU_PHONETIC_MAP)) {
  if (mapping.base) {
    reversePhoneticCache[mapping.base] = { key, shift: false };
  }
  if (mapping.shift) {
    reversePhoneticCache[mapping.shift] = { key, shift: true };
  }
}

for (const [key, mapping] of Object.entries(URDU_STANDARD_MAP)) {
  if (mapping.base) {
    reverseStandardCache[mapping.base] = { key, shift: false };
  }
  if (mapping.shift) {
    reverseStandardCache[mapping.shift] = { key, shift: true };
  }
}

/**
 * Returns physical QWERTY key and shift state for any target character.
 */
export function getPhysicalKeyForChar(
  char: string,
  layout: 'english' | 'urdu-phonetic' | 'urdu-standard' = 'english'
): { key: string; shift: boolean } {
  if (!char) return { key: '', shift: false };

  if (char === ' ') {
    return { key: 'space', shift: false };
  }

  if (layout === 'english') {
    const isUpper = char !== char.toLowerCase() && char === char.toUpperCase();
    const lower = char.toLowerCase();
    return { key: lower, shift: isUpper };
  }

  if (layout === 'urdu-phonetic') {
    if (reversePhoneticCache[char]) {
      return reversePhoneticCache[char];
    }
  } else if (layout === 'urdu-standard') {
    if (reverseStandardCache[char]) {
      return reverseStandardCache[char];
    }
  }

  // Fallback
  return { key: char.toLowerCase(), shift: false };
}

/**
 * Returns character to type based on physical key and Shift key for Urdu Phonetic
 */
export function getUrduPhoneticChar(key: string, isShift: boolean): string | null {
  const normKey = key.toLowerCase();
  const mapping = URDU_PHONETIC_MAP[normKey];
  if (!mapping) return null;
  return isShift ? (mapping.shift || mapping.base) : mapping.base;
}
