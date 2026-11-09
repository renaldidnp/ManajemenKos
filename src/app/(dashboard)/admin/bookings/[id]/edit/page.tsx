import { notFound } from "next/navigation";
import { BookingForm } from "@/features/bookings/components/booking-form";
import {
  getBooking,
  getBookingRoomOptions,
} from "@/features/bookings/server/queries";

type EditBookingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookingPage({
  params,
}: EditBookingPageProps) {
  const { id } = await params;
  const [booking, rooms] = await Promise.all([
    getBooking(id),
    getBookingRoomOptions(),
  ]);

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ubah booking {booking.code}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Perbarui data pemesan, kamar, dan jadwal masuk.
        </p>
      </div>

      <BookingForm mode="edit" booking={booking} rooms={rooms} />
    </div>
  );
}
