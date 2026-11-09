export const INVOICE_STATUSES = [
  "UNPAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  UNPAID: "Belum dibayar",
  PAID: "Sudah dibayar",
  OVERDUE: "Terlambat",
  CANCELLED: "Dibatalkan",
};

export const invoiceStatusVariants: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  UNPAID: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "outline",
};
