import { Plus, ReceiptText } from "lucide-react";
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
import { InvoiceActions } from "@/features/billing/components/invoice-actions";
import {
  invoiceStatusLabels,
  invoiceStatusVariants,
  type InvoiceStatus,
} from "@/features/billing/status";
import { formatCurrency, formatDate } from "@/lib/format";

type InvoiceRow = {
  id: string;
  number: string;
  amount: number;
  status: InvoiceStatus;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt: Date | null;
  tenant: {
    id: string;
    name: string;
    phone: string;
    room: {
      number: string;
      name: string | null;
    } | null;
  } | null;
  booking: {
    id: string;
    code: string;
    name: string;
    room: {
      number: string;
      name: string | null;
    } | null;
  } | null;
};

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <ReceiptText className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Belum ada tagihan</p>
          <p className="text-sm text-muted-foreground">
            Tagihan akan tampil di sini setelah booking dikonfirmasi.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bills/new">
            <Plus className="size-4" />
            Tambah tagihan
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
            <TableHead>Nomor</TableHead>
            <TableHead>Penghuni</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Jatuh tempo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const tenantName = invoice.tenant?.name ?? invoice.booking?.name;
            const room = invoice.booking?.room ?? invoice.tenant?.room;

            return (
              <TableRow key={invoice.id}>
                <TableCell>
                  <span className="font-mono text-xs">{invoice.number}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{tenantName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.tenant?.phone ?? invoice.booking?.code ?? ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {room ? (
                    <div>
                      <p className="font-medium">{room.number}</p>
                      {room.name ? (
                        <p className="text-xs text-muted-foreground">
                          {room.name}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(invoice.periodStart)} –{" "}
                  {formatDate(invoice.periodEnd)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{formatDate(invoice.dueDate)}</p>
                    {invoice.paidAt ? (
                      <p className="text-xs text-muted-foreground">
                        Dibayar {formatDate(invoice.paidAt)}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={invoiceStatusVariants[invoice.status]}>
                    {invoiceStatusLabels[invoice.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <InvoiceActions
                    invoiceId={invoice.id}
                    invoiceNumber={invoice.number}
                    status={invoice.status}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
