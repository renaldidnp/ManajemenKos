import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar</CardTitle>
        <CardDescription>
          Buat akun penghuni untuk mengajukan sewa dan memantau tagihan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
