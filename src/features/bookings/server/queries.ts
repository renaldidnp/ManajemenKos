import "server-only";
import { prisma } from "@/lib/db";

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
