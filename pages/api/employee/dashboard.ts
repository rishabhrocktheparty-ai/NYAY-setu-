import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  // user is the token payload; in production you'd include user id
  const employee = await prisma.courtEmployee.findUnique({
    where: { id: Number((user as any).id) || undefined },
  });

  const totalCases = await prisma.case.count({ where: { assigneeId: employee?.id } });
  const pendingTasks = await prisma.task.count({ where: { assigneeId: employee?.id, completed: false } });
  const unreadNotifications = await prisma.notification.count({ where: { recipientId: employee?.id, read: false } });

  res.json({
    profile: employee || { name: (user as any).name || 'Court Employee' },
    stats: { totalCases, pendingTasks, unreadNotifications },
  });
});
