import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { signJWT } from '../../../lib/auth';
import { isOtpExpired } from '../../../lib/otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { phone, email, otp } = req.body;
  if (!otp || (!phone && !email)) return res.status(400).json({ error: 'phone/email and otp are required' });

  try {
    const citizen = await prisma.citizen.findUnique({
      where: phone ? { phone } : { email: email! },
    });

    if (!citizen || citizen.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (isOtpExpired(citizen.otpExpiresAt)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Clear OTP fields
    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { otp: null, otpExpiresAt: null },
    });

    // Issue JWT. Payload includes id and role=citizen
    const token = signJWT({ id: citizen.id, role: 'citizen', name: citizen.name || null });

    return res.json({ ok: true, token });
  } catch (err: any) {
    console.error('verify error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}