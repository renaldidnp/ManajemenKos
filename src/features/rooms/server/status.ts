import "server-only";
import { prisma } from "@/lib/db";

export async function syncRoomStatus(roomId: string | null | undefined) {
  if (!roomId) {
    return;
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { status: true },
  });

  if (!room || room.status === "MAINTENANCE") {
    return;
  }

  const [activeTenants, confirmedBookings] = await Promise.all([
    prisma.tenant.count({
      where: { roomId, status: "ACTIVE" },
    }),
    prisma.booking.count({
      where: { roomId, status: "CONFIRMED" },
    }),
  ]);

  const nextStatus =
    activeTenants > 0 || confirmedBookings > 0 ? "OCCUPIED" : "AVAILABLE";

  if (room.status !== nextStatus) {
    await prisma.room.update({
      where: { id: roomId },
      data: { status: nextStatus },
    });
  }
}
