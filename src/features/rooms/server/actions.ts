"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionOk,
  type ActionResult,
} from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { toFieldErrors } from "@/lib/validation";
import { roomSchema, type RoomInput } from "@/features/rooms/schemas";

function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

function normalize(input: RoomInput) {
  return {
    number: input.number.trim(),
    name: input.name?.trim() || null,
    description: input.description?.trim() || null,
    priceMonthly: input.priceMonthly,
    size: input.size?.trim() || null,
    capacity: input.capacity,
    status: input.status,
    facilities: (input.facilities ?? [])
      .map((item) => item.trim())
      .filter(Boolean),
    images: (input.images ?? []).filter(Boolean),
  };
}

export async function createRoom(
  input: RoomInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = roomSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Data kamar tidak valid.", toFieldErrors(parsed.error));
  }

  const kos = await prisma.kos.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!kos) {
    return actionError(
      "Profil kos belum ada. Lengkapi data kos terlebih dahulu.",
    );
  }

  const data = normalize(parsed.data);

  try {
    const room = await prisma.room.create({
      data: {
        kosId: kos.id,
        number: data.number,
        name: data.name,
        description: data.description,
        priceMonthly: data.priceMonthly,
        size: data.size,
        capacity: data.capacity,
        status: data.status,
        facilities: data.facilities,
        images: {
          create: data.images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      select: { id: true },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/kos");

    return actionOk({ id: room.id });
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return actionError("Nomor kamar sudah dipakai.", {
        number: ["Nomor kamar sudah dipakai."],
      });
    }
    throw error;
  }
}

export async function updateRoom(
  id: string,
  input: RoomInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = roomSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Data kamar tidak valid.", toFieldErrors(parsed.error));
  }

  const existing = await prisma.room.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return actionError("Kamar tidak ditemukan.");
  }

  const data = normalize(parsed.data);

  try {
    const room = await prisma.room.update({
      where: { id },
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        priceMonthly: data.priceMonthly,
        size: data.size,
        capacity: data.capacity,
        status: data.status,
        facilities: data.facilities,
        images: {
          deleteMany: {},
          create: data.images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      select: { id: true },
    });

    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${id}/edit`);
    revalidatePath("/kos");

    return actionOk({ id: room.id });
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return actionError("Nomor kamar sudah dipakai.", {
        number: ["Nomor kamar sudah dipakai."],
      });
    }
    throw error;
  }
}

export async function deleteRoom(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    await prisma.room.delete({ where: { id } });
  } catch (error) {
    if (prismaErrorCode(error) === "P2003") {
      return actionError(
        "Kamar tidak bisa dihapus karena masih terhubung dengan booking atau penghuni.",
      );
    }
    if (prismaErrorCode(error) === "P2025") {
      return actionError("Kamar tidak ditemukan.");
    }
    throw error;
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/kos");

  return actionOk({ id });
}
