import "server-only";
import { prisma } from "@/lib/db";

export async function getInvoice(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      tenantId: true,
      periodStart: true,
      periodEnd: true,
      amount: true,
      status: true,
      dueDate: true,
      paidAt: true,
    },
  });
}

export async function getInvoiceTenantOptions() {
  return prisma.tenant.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      status: true,
      room: {
        select: {
          number: true,
          name: true,
        },
      },
    },
  });
}

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
          room: {
            select: {
              number: true,
              name: true,
            },
          },
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
