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
import { roomStatusLabels } from "@/features/rooms/schemas";
import {
  TENANT_STATUSES,
  tenantSchema,
  tenantStatusLabels,
  type TenantInput,
} from "@/features/tenants/schemas";
import {
  createTenant,
  updateTenant,
} from "@/features/tenants/server/actions";

type RoomOption = {
  id: string;
  number: string;
  name: string | null;
  status: keyof typeof roomStatusLabels;
};

type TenantFormProps = {
  mode: "create" | "edit";
  rooms: RoomOption[];
  tenant?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    idCardNumber: string | null;
    emergencyContact: string | null;
    roomId: string | null;
    status: (typeof TENANT_STATUSES)[number];
    startDate: Date;
    endDate: Date | null;
  };
};

function toDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function TenantForm({ mode, rooms, tenant }: TenantFormProps) {
  const router = useRouter();
  const form = useForm<TenantInput>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant?.name ?? "",
      phone: tenant?.phone ?? "",
      email: tenant?.email ?? "",
      idCardNumber: tenant?.idCardNumber ?? "",
      emergencyContact: tenant?.emergencyContact ?? "",
      roomId: tenant?.roomId ?? "",
      status: tenant?.status ?? "ACTIVE",
      startDate: tenant
        ? toDateInput(tenant.startDate)
        : toDateInput(new Date()),
      endDate: tenant?.endDate ? toDateInput(tenant.endDate) : "",
    },
  });

  async function onSubmit(values: TenantInput) {
    const result =
      mode === "edit" && tenant
        ? await updateTenant(tenant.id, values)
        : await createTenant(values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          form.setError(key as keyof TenantInput, { message: messages[0] });
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "edit" ? "Data penghuni diperbarui." : "Penghuni ditambahkan.",
    );
    router.push("/admin/tenants");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "edit" ? "Ubah penghuni" : "Tambah penghuni"}
            </CardTitle>
            <CardDescription>
              Lengkapi data penghuni, kamar, dan masa sewa.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama penghuni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor telepon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="0812xxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor KTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak darurat (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama / nomor kontak darurat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kamar</FormLabel>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kamar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Tanpa kamar</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {`${[room.number, room.name]
                            .filter(Boolean)
                            .join(" · ")} (${roomStatusLabels[room.status]})`}
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
                      {TENANT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {tenantStatusLabels[status]}
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
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal mulai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal selesai (opsional)</FormLabel>
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
            onClick={() => router.push("/admin/tenants")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan perubahan"
                : "Tambah penghuni"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
