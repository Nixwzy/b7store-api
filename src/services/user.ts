import { prisma } from '@/libs/prisma.js';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) return null;

  const hashPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    },
  });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return null;
  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) return null;

  const token = v4();
  await prisma.user.update({
    where: { id: user.id },
    data: { token },
  });

  return token;
};
