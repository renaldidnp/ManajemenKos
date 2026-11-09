import { BookingsTable } from "@/features/bookings/components/bookings-table";
import { getBookings } from "@/features/bookings/server/queries";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Booking</h1>
        <p className="mt-2 text-muted-foreground">
          Kelola pengajuan sewa dan status booking calon penghuni.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total booking</p>
          <p className="mt-1 text-2xl font-semibold">{bookings.length}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Menunggu konfirmasi</p>
          <p className="mt-1 text-2xl font-semibold">{pendingBookings}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Dikonfirmasi</p>
          <p className="mt-1 text-2xl font-semibold">{confirmedBookings}</p>
        </div>
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  );
}
