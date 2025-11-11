/**
 * Generate a cryptographically secure random token
 * Uses 32 bytes of entropy (256 bits) for security
 * Returns a 64-character hexadecimal string (URL-safe, no encoding needed)
 */
export function generateSecureToken(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validate token format (64 hex characters = 32 bytes)
 */
export function isValidTokenFormat(token: string): boolean {
  return /^[0-9a-f]{64}$/i.test(token);
}
