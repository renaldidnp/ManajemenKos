import "server-only";
import { prisma } from "@/lib/db";

export async function getInvoices() {
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      amount: true,
      status: true,
      periodStart: true,
      periodEnd: true,
      dueDate: true,
      paidAt: true,
      tenant: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      booking: {
        select: {
          id: true,
          code: true,
          name: true,
          room: {
            select: {
              number: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
