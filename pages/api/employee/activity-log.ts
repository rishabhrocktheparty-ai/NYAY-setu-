import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const employeeId = Number((user as any).id);
  const logs = await prisma.activityLog.findMany({ where: { actorId: employeeId }, orderBy: { createdAt: 'desc' }, take: 50 });
  res.json({ logs });
});
