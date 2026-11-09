import { z } from "zod";

export const TENANT_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const tenantStatusLabels: Record<
  (typeof TENANT_STATUSES)[number],
  string
> = {
  ACTIVE: "Aktif",
  INACTIVE: "Nonaktif",
};

export const tenantSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi").max(100),
    phone: z.string().trim().min(1, "Nomor telepon wajib diisi").max(30),
    email: z
      .union([z.email("Email tidak valid"), z.literal("")])
      .optional(),
    idCardNumber: z.string().trim().max(30).optional(),
    emergencyContact: z.string().trim().max(100).optional(),
    roomId: z.string().trim().optional(),
    status: z.enum(TENANT_STATUSES),
    startDate: z.iso.date("Tanggal mulai tidak valid"),
    endDate: z
      .union([z.iso.date("Tanggal selesai tidak valid"), z.literal("")])
      .optional(),
  })
  .refine(
    (data) =>
      !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "Tanggal selesai harus setelah tanggal mulai",
      path: ["endDate"],
    },
  );

export type TenantInput = z.infer<typeof tenantSchema>;
