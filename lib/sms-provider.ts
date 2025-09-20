// SMS provider abstraction. For local dev this logs; replace with Twilio/MSG91 adapter.
export async function sendSms(phone: string, message: string): Promise<void> {
  // In production, replace this with an SDK call (Twilio / MSG91 / etc.) using env vars.
  console.log(`[SMS] To: ${phone} — ${message}`);
  return Promise.resolve();
}