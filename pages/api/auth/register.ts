import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { generateOTP, otpExpiresInMinutes } from '../../../lib/otp';
import { sendSms } from '../../../lib/sms-provider';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { phone, email, name } = req.body;
  if (!phone && !email) return res.status(400).json({ error: 'phone or email is required' });

  const otp = generateOTP(6);
  const expiresAt = otpExpiresInMinutes(10);

  try {
    // upsert citizen record
    const citizen = await prisma.citizen.upsert({
      where: phone ? { phone } : { email: email! },
      update: { name: name || undefined, otp, otpExpiresAt: expiresAt },
      create: { name: name || undefined, phone: phone || undefined, email: email || undefined, otp, otpExpiresAt: expiresAt },
    });

    // send OTP via SMS (or log)
    if (phone) {
      await sendSms(phone, `Your NYAY Setu verification code is: ${otp}`);
    } else {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return res.json({ ok: true, message: 'OTP sent' });
  } catch (err: any) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}