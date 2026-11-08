import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <div className="rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Masuk</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Form login akan tersedia pada tahap autentikasi.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-foreground underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
