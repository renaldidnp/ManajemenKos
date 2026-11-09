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
