import { z } from "zod";
import { INVOICE_STATUSES } from "@/features/billing/status";

export const invoiceSchema = z
  .object({
    tenantId: z.string().trim().optional(),
    periodStart: z.iso.date("Tanggal mulai tidak valid"),
    periodEnd: z.iso.date("Tanggal selesai tidak valid"),
    amount: z
      .number()
      .int("Jumlah harus bilangan bulat")
      .positive("Jumlah harus lebih dari 0"),
    status: z.enum(INVOICE_STATUSES),
    dueDate: z.iso.date("Jatuh tempo tidak valid"),
  })
  .refine(
    (data) => new Date(data.periodEnd) >= new Date(data.periodStart),
    {
      message: "Periode selesai harus setelah periode mulai",
      path: ["periodEnd"],
    },
  );

export type InvoiceInput = z.infer<typeof invoiceSchema>;
