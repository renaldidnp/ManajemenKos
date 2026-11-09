import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InvoicesTable } from "@/features/billing/components/invoices-table";
import { getInvoices } from "@/features/billing/server/queries";
import { formatCurrency } from "@/lib/format";

export default async function AdminBillsPage() {
  const invoices = await getInvoices();
  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === "UNPAID" || invoice.status === "OVERDUE",
  );
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID",
  ).length;
  const outstandingAmount = unpaidInvoices.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tagihan</h1>
          <p className="mt-2 text-muted-foreground">
            Pantau tagihan sewa, jatuh tempo, dan status pembayaran.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bills/new">
            <Plus className="size-4" />
            Tambah tagihan
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total tagihan</p>
          <p className="mt-1 text-2xl font-semibold">{invoices.length}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Belum dibayar</p>
          <p className="mt-1 text-2xl font-semibold">
            {unpaidInvoices.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatCurrency(outstandingAmount)}
          </p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Sudah dibayar</p>
          <p className="mt-1 text-2xl font-semibold">{paidInvoices}</p>
        </div>
      </div>

      <InvoicesTable invoices={invoices} />
    </div>
  );
}
