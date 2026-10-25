// Phone validation for lead forms: RU (+7), China (+86), Hong Kong (+852), CIS.
// Basic "fool-proof" rules: correct country code, digit count, no repeated-digit junk.

export interface PhoneCheck {
  valid: boolean;
  error?: string;
  normalized?: string; // E.164-ish, e.g. +79990000000
}

interface PhoneRule {
  code: string;      // country code without '+'
  name: string;      // human-readable name
  digits: number[];  // allowed national number lengths
}

// Order matters: longer prefixes must come first (852 vs 8? not present, but 7 vs 375 etc.)
const PHONE_RULES: PhoneRule[] = [
  { code: '852', name: 'Гонконг (+852)', digits: [8] },
  { code: '998', name: 'Узбекистан (+998)', digits: [9] },
  { code: '996', name: 'Кыргызстан (+996)', digits: [9] },
  { code: '992', name: 'Таджикистан (+992)', digits: [9] },
  { code: '995', name: 'Грузия (+995)', digits: [9] },
  { code: '994', name: 'Азербайджан (+994)', digits: [9] },
  { code: '375', name: 'Беларусь (+375)', digits: [9] },
  { code: '380', name: 'Украина (+380)', digits: [9] },
  { code: '374', name: 'Армения (+374)', digits: [8] },
  { code: '373', name: 'Молдова (+373)', digits: [8] },
  { code: '86', name: 'Китай (+86)', digits: [11] },
  { code: '7', name: 'Россия / Казахстан (+7)', digits: [10] },
];

export const PHONE_HINT =
  'Поддерживаются: +7 (РФ), +86 (Китай), +852 (Гонконг), номера стран СНГ';

export function validatePhone(raw: string): PhoneCheck {
  if (!raw || !raw.trim()) {
    return { valid: false, error: 'Укажите номер телефона' };
  }

  // Keep digits and the first '+' only
  let p = raw.replace(/[^\d+]/g, '');
  p = p.replace(/(?!^)\+/g, '');
  if (!p) {
    return { valid: false, error: 'Номер должен содержать цифры' };
  }

  // 8XXXXXXXXXX (11 digits, RU style) -> +7XXXXXXXXXX
  if (/^8\d{10}$/.test(p)) {
    p = '+7' + p.slice(1);
  } else if (/^7\d{10}$/.test(p)) {
    p = '+' + p;
  }

  if (!p.startsWith('+')) {
    return {
      valid: false,
      error: 'Укажите номер в международном формате: +код страны и номер. ' + PHONE_HINT,
    };
  }

  const digitsOnly = p.slice(1);

  for (const rule of PHONE_RULES) {
    if (digitsOnly.startsWith(rule.code)) {
      const national = digitsOnly.slice(rule.code.length);
      if (!rule.digits.includes(national.length)) {
        return {
          valid: false,
          error: `${rule.name}: ожидается ${rule.digits.join(' или ')} цифр после кода страны`,
        };
      }
      const uniqueDigits = new Set(national.split('')).size;
      if (uniqueDigits < 3) {
        return {
          valid: false,
          error: 'Похоже на несуществующий номер (слишком много одинаковых цифр)',
        };
      }
      return { valid: true, normalized: p };
    }
  }

  return {
    valid: false,
    error: 'Неизвестный код страны. ' + PHONE_HINT,
  };
}
