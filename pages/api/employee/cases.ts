import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const employeeId = Number((user as any).id);
  if (req.method === 'GET') {
    const cases = await prisma.case.findMany({ where: { assigneeId: employeeId } });
    return res.json({ cases });
  }
  if (req.method === 'POST') {
    const { title, description } = req.body;
    const c = await prisma.case.create({ data: { title, description, assigneeId: employeeId } });
    return res.status(201).json(c);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
});
