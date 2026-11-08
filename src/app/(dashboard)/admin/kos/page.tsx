import { KosForm } from "@/features/kos/components/kos-form";
import { getKos } from "@/features/kos/server/queries";

export default async function AdminKosPage() {
  const kos = await getKos();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Profil kos</h1>
        <p className="mt-2 text-muted-foreground">
          Kelola informasi kos yang tampil di landing page.
        </p>
      </div>

      {kos ? (
        <KosForm kos={kos} />
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Data kos belum tersedia</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Jalankan seed database untuk membuat profil kos awal.
          </p>
        </div>
      )}
    </div>
  );
}
