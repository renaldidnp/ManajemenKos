import "server-only";
import { prisma } from "@/lib/db";

export async function getTenants() {
  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      status: true,
      startDate: true,
      endDate: true,
      room: {
        select: {
          id: true,
          number: true,
          name: true,
        },
      },
      _count: {
        select: { invoices: true },
      },
    },
  });
}

export async function getTenant(id: string) {
  return prisma.tenant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      idCardNumber: true,
      emergencyContact: true,
      roomId: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function getTenantRoomOptions() {
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
