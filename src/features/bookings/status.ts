export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
};

export const bookingStatusVariants: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CANCELLED: "destructive",
  EXPIRED: "outline",
};
