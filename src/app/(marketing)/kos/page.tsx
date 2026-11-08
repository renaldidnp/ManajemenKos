import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamar",
};

export default function KosListPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Daftar kamar</h1>
      <p className="mt-2 text-muted-foreground">
        Katalog kamar akan tampil di sini setelah data diisi.
      </p>
    </div>
  );
}
