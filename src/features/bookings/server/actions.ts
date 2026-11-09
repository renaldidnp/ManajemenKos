"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionOk,
  type ActionResult,
} from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { toFieldErrors } from "@/lib/validation";
import {
  BOOKING_STATUSES,
  type BookingStatus,
} from "@/features/bookings/status";
import { bookingSchema, type BookingInput } from "@/features/bookings/schemas";
import { syncRoomStatus } from "@/features/rooms/server/status";

function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

function normalize(input: BookingInput) {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    roomId: input.roomId.trim(),
    moveInDate: parseDate(input.moveInDate),
    durationMonths: input.durationMonths,
    status: input.status,
    notes: input.notes?.trim() || null,
  };
}

async function roomExists(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });

  return Boolean(room);
}

async function generateBookingCode() {
  const year = new Date().getFullYear();
  const prefix = `BK-${year}-`;
  const last = await prisma.booking.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: "desc" },
    select: { code: true },
  });
  const lastNumber = last
    ? Number.parseInt(last.code.slice(prefix.length), 10)
    : 0;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1;

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

function revalidateBookingPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/bills");
  revalidatePath("/kos");
}

export async function createBooking(
  input: BookingInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Data booking tidak valid.",
      toFieldErrors(parsed.error),
    );
  }

  const data = normalize(parsed.data);
  if (!(await roomExists(data.roomId))) {
    return actionError("Kamar tidak ditemukan.", {
      roomId: ["Kamar tidak ditemukan."],
    });
  }

  try {
    const code = await generateBookingCode();
    const booking = await prisma.booking.create({
      data: { ...data, code },
      select: { id: true, roomId: true },
    });

    await syncRoomStatus(booking.roomId);
    revalidateBookingPaths();

    return actionOk({ id: booking.id });
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return actionError("Kode booking sudah dipakai. Silakan coba lagi.");
    }
    if (prismaErrorCode(error) === "P2003") {
      return actionError("Kamar tidak ditemukan.", {
        roomId: ["Kamar tidak ditemukan."],
      });
    }
    throw error;
  }
}

export async function updateBooking(
  id: string,
  input: BookingInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Data booking tidak valid.",
      toFieldErrors(parsed.error),
    );
  }

  const existing = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!existing) {
    return actionError("Booking tidak ditemukan.");
  }

  const data = normalize(parsed.data);
  if (!(await roomExists(data.roomId))) {
    return actionError("Kamar tidak ditemukan.", {
      roomId: ["Kamar tidak ditemukan."],
    });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data,
    select: { id: true, roomId: true },
  });

  await syncRoomStatus(existing.roomId);
  if (booking.roomId !== existing.roomId) {
    await syncRoomStatus(booking.roomId);
  }
  revalidateBookingPaths();
  revalidatePath(`/admin/bookings/${id}/edit`);

  return actionOk({ id: booking.id });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<ActionResult<{ id: string; status: BookingStatus }>> {
  await requireAdmin();

  if (!BOOKING_STATUSES.includes(status)) {
    return actionError("Status booking tidak valid.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!booking) {
    return actionError("Booking tidak ditemukan.");
  }

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  await syncRoomStatus(booking.roomId);
  revalidateBookingPaths();

  return actionOk({ id, status });
}

export async function deleteBooking(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const existing = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!existing) {
    return actionError("Booking tidak ditemukan.");
  }

  try {
    await prisma.booking.delete({ where: { id } });
  } catch (error) {
    if (prismaErrorCode(error) === "P2003") {
      return actionError(
        "Booking tidak bisa dihapus karena masih terhubung dengan data lain.",
      );
    }
    if (prismaErrorCode(error) === "P2025") {
      return actionError("Booking tidak ditemukan.");
    }
    throw error;
  }

  await syncRoomStatus(existing.roomId);
  revalidateBookingPaths();

  return actionOk({ id });
}
