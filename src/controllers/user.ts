import { registerSchema } from '@/schemas/registerSchema.js';
import { createUser } from '@/services/user.js';
import { RequestHandler } from 'express';

export const register: RequestHandler = async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos' });
    return;
  }
  const { name, email, password } = result.data;

  const user = await createUser(name, email, password);
  if (!user) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
    return;
  }

  res.status(201).json({ error: null, user });
};
