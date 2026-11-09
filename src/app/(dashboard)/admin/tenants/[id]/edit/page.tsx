import { notFound } from "next/navigation";
import { TenantForm } from "@/features/tenants/components/tenant-form";
import {
  getTenant,
  getTenantRoomOptions,
} from "@/features/tenants/server/queries";

type EditTenantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const { id } = await params;
  const [tenant, rooms] = await Promise.all([
    getTenant(id),
    getTenantRoomOptions(),
  ]);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ubah penghuni {tenant.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Perbarui data penghuni, kamar, dan masa sewa.
        </p>
      </div>

      <TenantForm mode="edit" tenant={tenant} rooms={rooms} />
    </div>
  );
}
