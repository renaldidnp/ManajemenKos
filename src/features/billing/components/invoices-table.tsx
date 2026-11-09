import { ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

type InvoiceRow = {
  id: string;
  number: string;
  amount: number;
  status: "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt: Date | null;
  tenant: {
    id: string;
    name: string;
    phone: string;
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

const statusLabels: Record<InvoiceRow["status"], string> = {
  UNPAID: "Belum dibayar",
  PAID: "Sudah dibayar",
  OVERDUE: "Terlambat",
  CANCELLED: "Dibatalkan",
};

const statusVariants: Record<
  InvoiceRow["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  UNPAID: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "outline",
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const tenantName = invoice.tenant?.name ?? invoice.booking?.name;

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
                  {invoice.booking?.room ? (
                    <div>
                      <p className="font-medium">
                        {invoice.booking.room.number}
                      </p>
                      {invoice.booking.room.name ? (
                        <p className="text-xs text-muted-foreground">
                          {invoice.booking.room.name}
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
                  <Badge variant={statusVariants[invoice.status]}>
                    {statusLabels[invoice.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
