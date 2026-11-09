import { TenantForm } from "@/features/tenants/components/tenant-form";
import { getTenantRoomOptions } from "@/features/tenants/server/queries";

export default async function NewTenantPage() {
  const rooms = await getTenantRoomOptions();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tambah penghuni
        </h1>
        <p className="mt-2 text-muted-foreground">
          Isi data penghuni, kamar, dan masa sewa.
        </p>
      </div>

      <TenantForm mode="create" rooms={rooms} />
    </div>
  );
}
