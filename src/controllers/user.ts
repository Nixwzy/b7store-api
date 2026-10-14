import { addAddressSchema } from '@/schemas/addAddressSchema.js';
import { loginSchema } from '@/schemas/loginSchema.js';
import { registerSchema } from '@/schemas/registerSchema.js';
import { createAddress, createUser, loginUser } from '@/services/user.js';
import { RequestHandler } from 'express';
import { create } from 'node:domain';

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

export const login: RequestHandler = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos' });
    return;
  }
  const { email, password } = result.data;
  const token = await loginUser(email, password);
  if (!token) {
    res.status(400).json({ error: 'Email ou senha inválidos' });
    return;
  }

  res.json({ error: null, token });
};

export const addAddress: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ error: 'Acesso Negado' });
    return;
  }

  const result = addAddressSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos' });
    return;
  }

  const address = await createAddress(userId, result.data);
  if (!address) {
    res.status(400).json({ error: 'Erro ao criar endereço' });
    return;
  }

  res.status(201).json({ error: null, address });
};
