"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVOICE_STATUSES,
  invoiceStatusLabels,
  type InvoiceStatus,
} from "@/features/billing/status";
import { invoiceSchema, type InvoiceInput } from "@/features/billing/schemas";
import {
  createInvoice,
  updateInvoice,
} from "@/features/billing/server/actions";
import { tenantStatusLabels } from "@/features/tenants/schemas";

type TenantOption = {
  id: string;
  name: string;
  status: keyof typeof tenantStatusLabels;
  room: {
    number: string;
    name: string | null;
  } | null;
};

type InvoiceFormProps = {
  mode: "create" | "edit";
  tenants: TenantOption[];
  invoice?: {
    id: string;
    number: string;
    tenantId: string | null;
    periodStart: Date;
    periodEnd: Date;
    amount: number;
    status: InvoiceStatus;
    dueDate: Date;
  };
};

function toDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);

  return date;
}

export function InvoiceForm({ mode, tenants, invoice }: InvoiceFormProps) {
  const router = useRouter();
  const today = new Date();
  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      tenantId: invoice?.tenantId ?? "",
      periodStart: invoice
        ? toDateInput(invoice.periodStart)
        : toDateInput(today),
      periodEnd: invoice
        ? toDateInput(invoice.periodEnd)
        : toDateInput(addDays(today, 30)),
      amount: invoice?.amount ?? 0,
      status: invoice?.status ?? "UNPAID",
      dueDate: invoice ? toDateInput(invoice.dueDate) : toDateInput(addDays(today, 7)),
    },
  });

  async function onSubmit(values: InvoiceInput) {
    const result =
      mode === "edit" && invoice
        ? await updateInvoice(invoice.id, values)
        : await createInvoice(values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          form.setError(key as keyof InvoiceInput, { message: messages[0] });
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "edit" ? "Tagihan diperbarui." : "Tagihan ditambahkan.",
    );
    router.push("/admin/bills");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "edit" ? "Ubah tagihan" : "Tambah tagihan"}
            </CardTitle>
            <CardDescription>
              Lengkapi penghuni, periode sewa, jumlah, dan jatuh tempo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Penghuni (opsional)</FormLabel>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih penghuni" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Tanpa penghuni</SelectItem>
                      {tenants.map((tenant) => {
                        const roomLabel = tenant.room
                          ? [tenant.room.number, tenant.room.name]
                              .filter(Boolean)
                              .join(" ")
                          : null;

                        return (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {`${tenant.name}${roomLabel ? ` · ${roomLabel}` : ""} (${tenantStatusLabels[tenant.status]})`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="periodStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periode mulai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="periodEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periode selesai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1000}
                      value={field.value || ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? 0
                            : Number(event.target.value),
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INVOICE_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {invoiceStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jatuh tempo</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/bills")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan perubahan"
                : "Tambah tagihan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
