import z from 'zod';

export const addAddressSchema = z.object({
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  complement: z.string().optional(),
});
