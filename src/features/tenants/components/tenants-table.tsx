import { MessageCircle, Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteTenantButton } from "@/features/tenants/components/delete-tenant-button";
import { ToggleTenantStatusButton } from "@/features/tenants/components/toggle-tenant-status-button";
import { tenantStatusLabels } from "@/features/tenants/schemas";
import { formatDate } from "@/lib/format";

type TenantRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: "ACTIVE" | "INACTIVE";
  startDate: Date;
  endDate: Date | null;
  room: {
    id: string;
    number: string;
    name: string | null;
  } | null;
  _count: {
    invoices: number;
  };
};

export function TenantsTable({ tenants }: { tenants: TenantRow[] }) {
  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <Users className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Belum ada penghuni</p>
          <p className="text-sm text-muted-foreground">
            Data penghuni akan muncul setelah booking dikonfirmasi atau
            ditambahkan oleh pengelola.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tenants/new">
            <Plus className="size-4" />
            Tambah penghuni
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Penghuni</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Masa sewa</TableHead>
            <TableHead>Tagihan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-40 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const whatsapp = tenant.phone
              .replace(/\D/g, "")
              .replace(/^0/, "62");

            return (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[tenant.phone, tenant.email].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {tenant.room ? (
                    <div>
                      <p className="font-medium">{tenant.room.number}</p>
                      {tenant.room.name ? (
                        <p className="text-xs text-muted-foreground">
                          {tenant.room.name}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <p>{formatDate(tenant.startDate)}</p>
                  <p className="text-xs text-muted-foreground">
                    {tenant.endDate
                      ? `s.d. ${formatDate(tenant.endDate)}`
                      : "Tanpa batas"}
                  </p>
                </TableCell>
                <TableCell>{tenant._count.invoices}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      tenant.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {tenantStatusLabels[tenant.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {whatsapp ? (
                      <Button asChild variant="ghost" size="icon">
                        <a
                          href={`https://wa.me/${whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Chat WhatsApp ${tenant.name}`}
                          title="Chat WhatsApp"
                        >
                          <MessageCircle className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                    <ToggleTenantStatusButton
                      tenantId={tenant.id}
                      status={tenant.status}
                    />
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        href={`/admin/tenants/${tenant.id}/edit`}
                        aria-label="Ubah penghuni"
                        title="Ubah penghuni"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteTenantButton
                      tenantId={tenant.id}
                      tenantName={tenant.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
