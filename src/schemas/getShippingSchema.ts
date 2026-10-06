import z from "zod";

export const getShippingSchema = z.object({
    zipcode: z.string().min(4)
})