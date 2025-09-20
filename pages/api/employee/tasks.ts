import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const employeeId = Number((user as any).id);
  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({ where: { assigneeId: employeeId } });
    return res.json({ tasks });
  }
  if (req.method === 'POST') {
    const { title, description, dueDate } = req.body;
    const t = await prisma.task.create({ data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined, assigneeId: employeeId } });
    return res.status(201).json(t);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
});
