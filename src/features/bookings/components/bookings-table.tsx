import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

type BookingRow = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  moveInDate: Date;
  durationMonths: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  room: {
    id: string;
    number: string;
    name: string | null;
  } | null;
  invoice: {
    id: string;
    number: string;
    status: string;
  } | null;
};

const statusLabels: Record<BookingRow["status"], string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
};

const statusVariants: Record<
  BookingRow["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CANCELLED: "destructive",
  EXPIRED: "outline",
};

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <CalendarCheck className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Belum ada booking</p>
          <p className="text-sm text-muted-foreground">
            Pengajuan sewa dari calon penghuni akan tampil di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Pemesan</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Jadwal masuk</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Tagihan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <span className="font-mono text-xs">{booking.code}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[booking.phone, booking.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {booking.room ? (
                  <div>
                    <p className="font-medium">{booking.room.number}</p>
                    {booking.room.name ? (
                      <p className="text-xs text-muted-foreground">
                        {booking.room.name}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{formatDate(booking.moveInDate)}</TableCell>
              <TableCell>{booking.durationMonths} bulan</TableCell>
              <TableCell>
                {booking.invoice ? (
                  <span className="font-mono text-xs">
                    {booking.invoice.number}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[booking.status]}>
                  {statusLabels[booking.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
