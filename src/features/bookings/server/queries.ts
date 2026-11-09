import "server-only";
import { prisma } from "@/lib/db";

export async function getBooking(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      phone: true,
      email: true,
      roomId: true,
      moveInDate: true,
      durationMonths: true,
      status: true,
      notes: true,
    },
  });
}

export async function getBookingRoomOptions() {
  return prisma.room.findMany({
    orderBy: { number: "asc" },
    select: {
      id: true,
      number: true,
      name: true,
      status: true,
    },
  });
}

export async function getBookings() {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      name: true,
      phone: true,
      email: true,
      moveInDate: true,
      durationMonths: true,
      status: true,
      createdAt: true,
      room: {
        select: {
          id: true,
          number: true,
          name: true,
        },
      },
      invoice: {
        select: {
          id: true,
          number: true,
          status: true,
        },
      },
    },
  });
}
