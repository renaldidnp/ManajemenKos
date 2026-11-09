import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TenantsTable } from "@/features/tenants/components/tenants-table";
import { getTenants } from "@/features/tenants/server/queries";

export default async function AdminTenantsPage() {
  const tenants = await getTenants();
  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "ACTIVE",
  ).length;
  const inactiveTenants = tenants.length - activeTenants;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Penghuni</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola data penghuni, kamar, dan masa sewa.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tenants/new">
            <Plus className="size-4" />
            Tambah penghuni
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total penghuni</p>
          <p className="mt-1 text-2xl font-semibold">{tenants.length}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Aktif</p>
          <p className="mt-1 text-2xl font-semibold">{activeTenants}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Nonaktif</p>
          <p className="mt-1 text-2xl font-semibold">{inactiveTenants}</p>
        </div>
      </div>

      <TenantsTable tenants={tenants} />
    </div>
  );
}
