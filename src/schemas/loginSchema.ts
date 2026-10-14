import z from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});
