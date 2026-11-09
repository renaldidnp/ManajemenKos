import { notFound } from "next/navigation";
import { InvoiceForm } from "@/features/billing/components/invoice-form";
import {
  getInvoice,
  getInvoiceTenantOptions,
} from "@/features/billing/server/queries";

type EditBillPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;
  const [invoice, tenants] = await Promise.all([
    getInvoice(id),
    getInvoiceTenantOptions(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ubah tagihan {invoice.number}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Perbarui penghuni, periode sewa, jumlah, dan jatuh tempo.
        </p>
      </div>

      <InvoiceForm mode="edit" invoice={invoice} tenants={tenants} />
    </div>
  );
}
