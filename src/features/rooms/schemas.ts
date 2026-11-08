import { z } from "zod";

export const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"] as const;

export const roomStatusLabels: Record<(typeof ROOM_STATUSES)[number], string> =
  {
    AVAILABLE: "Tersedia",
    OCCUPIED: "Terisi",
    MAINTENANCE: "Perbaikan",
  };

export const roomSchema = z.object({
  number: z.string().trim().min(1, "Nomor kamar wajib diisi").max(20),
  name: z.string().trim().max(100).optional(),
  description: z.string().trim().max(2000).optional(),
  priceMonthly: z.number().int().positive("Harga harus lebih dari 0"),
  size: z.string().trim().max(50).optional(),
  capacity: z.number().int().min(1, "Kapasitas minimal 1").max(20),
  status: z.enum(ROOM_STATUSES),
  facilities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export type RoomInput = z.infer<typeof roomSchema>;
