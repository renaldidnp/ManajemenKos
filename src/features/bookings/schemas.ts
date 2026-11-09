import { z } from "zod";
import { BOOKING_STATUSES } from "@/features/bookings/status";

export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  phone: z.string().trim().min(1, "Nomor telepon wajib diisi").max(30),
  email: z
    .union([z.email("Email tidak valid"), z.literal("")])
    .optional(),
  roomId: z.string().trim().min(1, "Kamar wajib dipilih"),
  moveInDate: z.iso.date("Tanggal masuk tidak valid"),
  durationMonths: z
    .number()
    .int("Durasi harus bilangan bulat")
    .min(1, "Durasi minimal 1 bulan")
    .max(60, "Durasi maksimal 60 bulan"),
  status: z.enum(BOOKING_STATUSES),
  notes: z.string().trim().max(1000).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
