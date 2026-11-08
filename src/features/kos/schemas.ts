import { z } from "zod";

export const kosSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  description: z.string().trim().max(2000).optional(),
  address: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  province: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(10).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  priceFrom: z.number().int().nonnegative().nullable().optional(),
  published: z.boolean(),
});

export type KosInput = z.infer<typeof kosSchema>;
