/**
 * Beta program constants
 */

// Token expiration
export const BETA_TOKEN_EXPIRY_DAYS = 30;
export const BETA_TOKEN_EXPIRY_MS =
  BETA_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Site URLs
export const SITE_URL = process.env.FRONT_END_URL || "https://buzztrip.co";
export const getBetaConfirmationUrl = (token: string) =>
  `${SITE_URL}/confirm-waitlist?token=${token}`;
export const APP_URL = `${SITE_URL}/app`;
