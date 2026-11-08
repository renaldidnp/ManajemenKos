import "server-only";
import { prisma } from "@/lib/db";

export async function getRooms() {
  return prisma.room.findMany({
    orderBy: { number: "asc" },
    select: {
      id: true,
      number: true,
      name: true,
      priceMonthly: true,
      capacity: true,
      status: true,
      size: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
    },
  });
}

export async function getPublicRoom(id: string) {
  return prisma.room.findFirst({
    where: { id, kos: { published: true } },
    select: {
      id: true,
      number: true,
      name: true,
      description: true,
      priceMonthly: true,
      size: true,
      capacity: true,
      status: true,
      facilities: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { url: true, alt: true },
      },
      kos: {
        select: {
          name: true,
          slug: true,
          address: true,
          city: true,
          province: true,
          phone: true,
          whatsapp: true,
        },
      },
    },
  });
}

export async function getRoom(id: string) {
  return prisma.room.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      name: true,
      description: true,
      priceMonthly: true,
      size: true,
      capacity: true,
      status: true,
      facilities: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
    },
  });
}
