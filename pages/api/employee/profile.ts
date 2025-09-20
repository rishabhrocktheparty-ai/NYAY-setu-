import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default requireAuth(async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const employeeId = Number((user as any).id);
  if (req.method === 'GET') {
    const profile = await prisma.courtEmployee.findUnique({ where: { id: employeeId } });
    return res.json({ profile });
  }
  if (req.method === 'PUT') {
    const { name, email, mobile } = req.body;
    const updated = await prisma.courtEmployee.update({ where: { id: employeeId }, data: { name, email, mobile } });
    return res.json({ profile: updated });
  }
  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
});
