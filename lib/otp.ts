import { randomInt } from 'crypto';

export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[randomInt(0, digits.length)];
  }
  return otp;
}

export function otpExpiresInMinutes(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isOtpExpired(expiresAt?: Date | null): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}