import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const employeeId = Number((user as any).id);
  if (req.method === 'GET') {
    const notifs = await prisma.notification.findMany({ where: { recipientId: employeeId }, orderBy: { createdAt: 'desc' } });
    return res.json({ notifications: notifs });
  }
  if (req.method === 'PATCH') {
    // mark all as read
    await prisma.notification.updateMany({ where: { recipientId: employeeId, read: false }, data: { read: true } });
    return res.json({ ok: true });
  }
  res.setHeader('Allow', ['GET', 'PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
});
