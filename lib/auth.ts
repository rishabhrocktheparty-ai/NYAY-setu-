import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from './constants';

export function signJWT(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const auth = req.headers.authorization || '';
    const m = auth.match(/^Bearer (.+)$/);
    if (!m) return res.status(401).json({ error: 'Unauthorized' });
    const token = m[1];
    const user = verifyJWT(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    return handler(req, res, user);
  };
}
