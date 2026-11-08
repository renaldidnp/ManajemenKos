import "server-only";
import { prisma } from "@/lib/db";

const publicKosSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  address: true,
  city: true,
  province: true,
  postalCode: true,
  phone: true,
  whatsapp: true,
  priceFrom: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: { url: true, alt: true },
  },
  rooms: {
    orderBy: { number: "asc" as const },
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
        orderBy: { sortOrder: "asc" as const },
        select: { url: true, alt: true },
      },
    },
  },
} as const;

export async function getKos() {
  return prisma.kos.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      address: true,
      city: true,
      province: true,
      postalCode: true,
      phone: true,
      whatsapp: true,
      priceFrom: true,
      published: true,
    },
  });
}

export async function getPublicKos() {
  return prisma.kos.findFirst({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    select: publicKosSelect,
  });
}

export async function getPublicKosBySlug(slug: string) {
  return prisma.kos.findFirst({
    where: { slug, published: true },
    select: publicKosSelect,
  });
}
