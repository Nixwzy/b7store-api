import { getUserIdByToken } from '@/services/user.js';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string | number;
    }
  }
}

const sendUnauthorized = (res: Response) => {
  res.status(401).json({ error: 'Acesso negado' });
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      sendUnauthorized(res);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendUnauthorized(res);
      return;
    }

    const userId = await getUserIdByToken(token);
    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    req.userId = userId;
    next();
  } catch (error) {
    sendUnauthorized(res);
  }
};
