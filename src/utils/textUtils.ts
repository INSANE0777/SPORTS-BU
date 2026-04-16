/**
 * Sanitizes sport name by removing " boys" or " girls" suffixes
 */
export function sanitizeSport(sport: string): string {
  if (!sport) return "";
  return sport.replace(/\s+(boys|girls)$/i, "").trim();
}

/**
 * Converts text to uppercase
 */
export function toCaps(text: string): string {
  if (!text) return "";
  return text.toUpperCase();
}
