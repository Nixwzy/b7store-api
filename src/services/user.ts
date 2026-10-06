import { prisma } from '@/libs/prisma.js';
import { hash } from 'bcryptjs';

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
