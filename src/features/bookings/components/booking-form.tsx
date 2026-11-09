"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BOOKING_STATUSES,
  bookingStatusLabels,
  type BookingStatus,
} from "@/features/bookings/status";
import { bookingSchema, type BookingInput } from "@/features/bookings/schemas";
import {
  createBooking,
  updateBooking,
} from "@/features/bookings/server/actions";
import { roomStatusLabels } from "@/features/rooms/schemas";

type RoomOption = {
  id: string;
  number: string;
  name: string | null;
  status: keyof typeof roomStatusLabels;
};

type BookingFormProps = {
  mode: "create" | "edit";
  rooms: RoomOption[];
  booking?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    roomId: string;
    moveInDate: Date;
    durationMonths: number;
    status: BookingStatus;
    notes: string | null;
  };
};

function toDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function BookingForm({ mode, rooms, booking }: BookingFormProps) {
  const router = useRouter();
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: booking?.name ?? "",
      phone: booking?.phone ?? "",
      email: booking?.email ?? "",
      roomId: booking?.roomId ?? "",
      moveInDate: booking
        ? toDateInput(booking.moveInDate)
        : toDateInput(new Date()),
      durationMonths: booking?.durationMonths ?? 1,
      status: booking?.status ?? "PENDING",
      notes: booking?.notes ?? "",
    },
  });

  async function onSubmit(values: BookingInput) {
    const result =
      mode === "edit" && booking
        ? await updateBooking(booking.id, values)
        : await createBooking(values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          form.setError(key as keyof BookingInput, { message: messages[0] });
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "edit" ? "Booking diperbarui." : "Booking ditambahkan.",
    );
    router.push("/admin/bookings");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "edit" ? "Ubah booking" : "Tambah booking"}
            </CardTitle>
            <CardDescription>
              Lengkapi data pemesan, kamar, dan jadwal masuk.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama pemesan</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama calon penghuni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor telepon</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0812xxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kamar</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kamar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {`${[room.number, room.name]
                            .filter(Boolean)
                            .join(" · ")} (${roomStatusLabels[room.status]})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal masuk</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi (bulan)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={field.value || ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? 0
                            : Number(event.target.value),
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BOOKING_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {bookingStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Catatan (opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Catatan tambahan untuk booking ini"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/bookings")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan perubahan"
                : "Tambah booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
