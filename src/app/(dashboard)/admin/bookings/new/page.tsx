import { BookingForm } from "@/features/bookings/components/booking-form";
import { getBookingRoomOptions } from "@/features/bookings/server/queries";

export default async function NewBookingPage() {
  const rooms = await getBookingRoomOptions();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tambah booking
        </h1>
        <p className="mt-2 text-muted-foreground">
          Isi data pemesan, kamar, dan jadwal masuk.
        </p>
      </div>

      <BookingForm mode="create" rooms={rooms} />
    </div>
  );
}
