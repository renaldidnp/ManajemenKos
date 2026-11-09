import { CalendarCheck, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingActions } from "@/features/bookings/components/booking-actions";
import {
  bookingStatusLabels,
  bookingStatusVariants,
  type BookingStatus,
} from "@/features/bookings/status";
import { formatDate } from "@/lib/format";

type BookingRow = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  moveInDate: Date;
  durationMonths: number;
  status: BookingStatus;
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
        <Button asChild>
          <Link href="/admin/bookings/new">
            <Plus className="size-4" />
            Tambah booking
          </Link>
        </Button>
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
            <TableHead className="w-40 text-right">Aksi</TableHead>
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
                <Badge variant={bookingStatusVariants[booking.status]}>
                  {bookingStatusLabels[booking.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <BookingActions
                  bookingId={booking.id}
                  bookingCode={booking.code}
                  bookingName={booking.name}
                  status={booking.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
