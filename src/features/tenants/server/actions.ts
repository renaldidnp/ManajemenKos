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
import { syncRoomStatus } from "@/features/rooms/server/status";
import { tenantSchema, type TenantInput } from "@/features/tenants/schemas";

function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

function normalize(input: TenantInput) {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    idCardNumber: input.idCardNumber?.trim() || null,
    emergencyContact: input.emergencyContact?.trim() || null,
    roomId: input.roomId?.trim() || null,
    status: input.status,
    startDate: parseDate(input.startDate),
    endDate: input.endDate ? parseDate(input.endDate) : null,
  };
}

async function roomExists(roomId: string | null) {
  if (!roomId) {
    return true;
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });

  return Boolean(room);
}

function revalidateTenantPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/tenants");
  revalidatePath("/admin/rooms");
  revalidatePath("/kos");
}

export async function createTenant(
  input: TenantInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = tenantSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Data penghuni tidak valid.", toFieldErrors(parsed.error));
  }

  const data = normalize(parsed.data);
  if (!(await roomExists(data.roomId))) {
    return actionError("Kamar tidak ditemukan.");
  }

  const tenant = await prisma.tenant.create({
    data,
    select: { id: true, roomId: true },
  });

  await syncRoomStatus(tenant.roomId);
  revalidateTenantPaths();

  return actionOk({ id: tenant.id });
}

export async function updateTenant(
  id: string,
  input: TenantInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = tenantSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Data penghuni tidak valid.", toFieldErrors(parsed.error));
  }

  const existing = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!existing) {
    return actionError("Penghuni tidak ditemukan.");
  }

  const data = normalize(parsed.data);
  if (!(await roomExists(data.roomId))) {
    return actionError("Kamar tidak ditemukan.");
  }

  const tenant = await prisma.tenant.update({
    where: { id },
    data,
    select: { id: true, roomId: true },
  });

  await syncRoomStatus(existing.roomId);
  if (tenant.roomId !== existing.roomId) {
    await syncRoomStatus(tenant.roomId);
  }
  revalidateTenantPaths();
  revalidatePath(`/admin/tenants/${id}/edit`);

  return actionOk({ id: tenant.id });
}

export async function toggleTenantStatus(
  id: string,
): Promise<ActionResult<{ id: string; status: "ACTIVE" | "INACTIVE" }>> {
  await requireAdmin();

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, status: true, roomId: true },
  });

  if (!tenant) {
    return actionError("Penghuni tidak ditemukan.");
  }

  const status = tenant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await prisma.tenant.update({
    where: { id },
    data: { status },
  });

  await syncRoomStatus(tenant.roomId);
  revalidateTenantPaths();

  return actionOk({ id, status });
}

export async function deleteTenant(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const existing = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!existing) {
    return actionError("Penghuni tidak ditemukan.");
  }

  try {
    await prisma.tenant.delete({ where: { id } });
  } catch (error) {
    if (prismaErrorCode(error) === "P2003") {
      return actionError(
        "Penghuni tidak bisa dihapus karena masih terhubung dengan data lain.",
      );
    }
    if (prismaErrorCode(error) === "P2025") {
      return actionError("Penghuni tidak ditemukan.");
    }
    throw error;
  }

  await syncRoomStatus(existing.roomId);
  revalidateTenantPaths();

  return actionOk({ id });
}
