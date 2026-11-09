import { InvoiceForm } from "@/features/billing/components/invoice-form";
import { getInvoiceTenantOptions } from "@/features/billing/server/queries";

export default async function NewBillPage() {
  const tenants = await getInvoiceTenantOptions();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tambah tagihan
        </h1>
        <p className="mt-2 text-muted-foreground">
          Isi penghuni, periode sewa, jumlah, dan jatuh tempo.
        </p>
      </div>

      <InvoiceForm mode="create" tenants={tenants} />
    </div>
  );
}
