import { PrismaClient } from '../generated/prisma/client.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn']
} as any); // <-- A mágica acontece aqui. Cala o erro do accelerateUrl.

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;