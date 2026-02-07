/* Verification */
export const OTP_TTL = 120 * 1000; // 2min
export const SESSION_TTL = 600 * 1000; // 10 min
export const SPAM_TTL = 600 * 1000; // 10 min
export const MAX_OTP_RETRIES = 2;

/* Tokens Expiry Time */
export const ACCESS_TOKEN_EXP = 7 * 24 * 60 * 60 * 1000; // 1 week
export const REFRESH_TOKEN_EXP = 30 * 24 * 60 * 60 * 1000; // 30 days

/* Forgotten password Email verification Token */
export const FORGOTTEN_EXP = 60 * 1000; // 1min
