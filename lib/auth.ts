import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'nyay-setu-dev-secret';

export function signJWT(payload: object, expiresIn = '7d'): string {
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Small Next.js API middleware helper to require authentication and optional roles
export function requireAuth(handler: any, allowedRoles?: string[]) {
  return async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
    const authHeader = (req.headers.authorization || '') as string;
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const user = verifyJWT(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    return handler(req, res);
  };
}