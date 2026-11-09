import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const statusLabels: Record<TenantRow["status"], string> = {
  ACTIVE: "Aktif",
  INACTIVE: "Nonaktif",
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
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
                  variant={tenant.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {statusLabels[tenant.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
