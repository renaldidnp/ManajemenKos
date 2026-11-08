import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <div className="rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Daftar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Form pendaftaran akan tersedia pada tahap autentikasi.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
