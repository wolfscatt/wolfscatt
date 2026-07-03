const TURKISH_CHAR_MAP: Record<string, string> = {
  "ğ": "g",
  "Ğ": "g",
  "ü": "u",
  "Ü": "u",
  "ş": "s",
  "Ş": "s",
  "ı": "i",
  "I": "i",
  "İ": "i",
  "ö": "o",
  "Ö": "o",
  "ç": "c",
  "Ç": "c",
};

export function createSlug(value: string) {
  return value
    .trim()
    .replace(/[ğĞüÜşŞıIİöÖçÇ]/g, (character) => TURKISH_CHAR_MAP[character] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
