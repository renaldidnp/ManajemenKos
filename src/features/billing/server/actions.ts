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
import type { InvoiceStatus } from "@/features/billing/status";
import { invoiceSchema, type InvoiceInput } from "@/features/billing/schemas";

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

function normalize(input: InvoiceInput) {
  return {
    tenantId: input.tenantId?.trim() || null,
    periodStart: parseDate(input.periodStart),
    periodEnd: parseDate(input.periodEnd),
    amount: input.amount,
    status: input.status,
    dueDate: parseDate(input.dueDate),
  };
}

async function tenantExists(tenantId: string | null) {
  if (!tenantId) {
    return true;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });

  return Boolean(tenant);
}

async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await prisma.invoice.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const lastNumber = last
    ? Number.parseInt(last.number.slice(prefix.length), 10)
    : 0;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1;

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

function revalidateInvoicePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/bills");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/tenants");
}

export async function createInvoice(
  input: InvoiceInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Data tagihan tidak valid.",
      toFieldErrors(parsed.error),
    );
  }

  const data = normalize(parsed.data);
  if (!(await tenantExists(data.tenantId))) {
    return actionError("Penghuni tidak ditemukan.", {
      tenantId: ["Penghuni tidak ditemukan."],
    });
  }

  try {
    const number = await generateInvoiceNumber();
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        number,
        paidAt: data.status === "PAID" ? new Date() : null,
      },
      select: { id: true },
    });

    revalidateInvoicePaths();

    return actionOk({ id: invoice.id });
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return actionError("Nomor tagihan sudah dipakai. Silakan coba lagi.");
    }
    if (prismaErrorCode(error) === "P2003") {
      return actionError("Penghuni tidak ditemukan.", {
        tenantId: ["Penghuni tidak ditemukan."],
      });
    }
    throw error;
  }
}

export async function updateInvoice(
  id: string,
  input: InvoiceInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Data tagihan tidak valid.",
      toFieldErrors(parsed.error),
    );
  }

  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, status: true, paidAt: true },
  });

  if (!existing) {
    return actionError("Tagihan tidak ditemukan.");
  }

  const data = normalize(parsed.data);
  if (!(await tenantExists(data.tenantId))) {
    return actionError("Penghuni tidak ditemukan.", {
      tenantId: ["Penghuni tidak ditemukan."],
    });
  }

  const paidAt =
    data.status === "PAID" ? (existing.paidAt ?? new Date()) : null;

  await prisma.invoice.update({
    where: { id },
    data: { ...data, paidAt },
  });

  revalidateInvoicePaths();
  revalidatePath(`/admin/bills/${id}/edit`);

  return actionOk({ id });
}

export async function toggleInvoicePaid(
  id: string,
): Promise<ActionResult<{ id: string; status: InvoiceStatus }>> {
  await requireAdmin();

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!invoice) {
    return actionError("Tagihan tidak ditemukan.");
  }

  if (invoice.status === "CANCELLED") {
    return actionError(
      "Tagihan yang dibatalkan tidak bisa diubah status pembayarannya.",
    );
  }

  const status: InvoiceStatus = invoice.status === "PAID" ? "UNPAID" : "PAID";

  await prisma.invoice.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });

  revalidateInvoicePaths();

  return actionOk({ id, status });
}

export async function deleteInvoice(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return actionError("Tagihan tidak ditemukan.");
  }

  try {
    await prisma.invoice.delete({ where: { id } });
  } catch (error) {
    if (prismaErrorCode(error) === "P2003") {
      return actionError(
        "Tagihan tidak bisa dihapus karena masih terhubung dengan data lain.",
      );
    }
    if (prismaErrorCode(error) === "P2025") {
      return actionError("Tagihan tidak ditemukan.");
    }
    throw error;
  }

  revalidateInvoicePaths();

  return actionOk({ id });
}
