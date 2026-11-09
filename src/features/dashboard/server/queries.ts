import "server-only";
import { prisma } from "@/lib/db";

export async function getAdminDashboardData() {
  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    totalTenants,
    activeTenants,
    pendingBookings,
    confirmedBookings,
    unpaidInvoices,
    overdueInvoices,
    invoiceTotals,
    paidTotals,
    outstandingTotals,
    recentBookings,
    attentionInvoices,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
    prisma.room.count({ where: { status: "OCCUPIED" } }),
    prisma.room.count({ where: { status: "MAINTENANCE" } }),
    prisma.tenant.count(),
    prisma.tenant.count({ where: { status: "ACTIVE" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.invoice.count({
      where: { status: { in: ["UNPAID", "OVERDUE"] } },
    }),
    prisma.invoice.count({ where: { status: "OVERDUE" } }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: { in: ["UNPAID", "OVERDUE"] } },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        name: true,
        moveInDate: true,
        durationMonths: true,
        status: true,
        room: {
          select: {
            number: true,
            name: true,
          },
        },
      },
    }),
    prisma.invoice.findMany({
      take: 5,
      where: { status: { in: ["UNPAID", "OVERDUE"] } },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        number: true,
        amount: true,
        status: true,
        dueDate: true,
        tenant: {
          select: {
            name: true,
          },
        },
        booking: {
          select: {
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
    }),
  ]);

  return {
    rooms: {
      total: totalRooms,
      available: availableRooms,
      occupied: occupiedRooms,
      maintenance: maintenanceRooms,
    },
    tenants: {
      total: totalTenants,
      active: activeTenants,
    },
    bookings: {
      pending: pendingBookings,
      confirmed: confirmedBookings,
    },
    invoices: {
      unpaid: unpaidInvoices,
      overdue: overdueInvoices,
      totalAmount: invoiceTotals._sum.amount ?? 0,
      paidAmount: paidTotals._sum.amount ?? 0,
      outstandingAmount: outstandingTotals._sum.amount ?? 0,
    },
    recentBookings,
    attentionInvoices,
  };
}
