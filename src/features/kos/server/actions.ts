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
import { kosSchema, type KosInput } from "@/features/kos/schemas";

export async function updateKos(
  input: KosInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = kosSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Data kos tidak valid.", toFieldErrors(parsed.error));
  }

  const existing = await prisma.kos.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!existing) {
    return actionError("Data kos belum tersedia.");
  }

  const data = parsed.data;

  const updated = await prisma.kos.update({
    where: { id: existing.id },
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      city: data.city || null,
      province: data.province || null,
      postalCode: data.postalCode || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      priceFrom: data.priceFrom ?? null,
      published: data.published,
    },
    select: { id: true },
  });

  revalidatePath("/admin/kos");
  revalidatePath("/");

  return actionOk({ id: updated.id });
}
