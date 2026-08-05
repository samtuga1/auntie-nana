/**
 * Validates a Ghana phone number.
 * Accepts local format (0XXXXXXXXX) or international format (+233XXXXXXXXX).
 */
export function isValidGhanaPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "")
  return /^(0[2-9]\d{8}|\+233[2-9]\d{8})$/.test(cleaned)
}

/**
 * Normalises any valid Ghana phone number to E.164 (+233XXXXXXXXX).
 * Handles: 0XXXXXXXXX, +233XXXXXXXXX, +2330XXXXXXXXX, 233XXXXXXXXX.
 *
 * Always call this before sending a phone number to the API.
 */
export function normalizeGhanaPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "")
  if (cleaned.startsWith("+2330")) return "+233" + cleaned.slice(5)
  if (cleaned.startsWith("+233")) return cleaned
  if (cleaned.startsWith("2330")) return "+233" + cleaned.slice(4)
  if (cleaned.startsWith("233")) return "+" + cleaned
  if (cleaned.startsWith("0")) return "+233" + cleaned.slice(1)
  return cleaned
}

export const GHANA_PHONE_ERROR =
  "Enter a valid Ghana phone number (e.g. 0244123456 or +233244123456)"
