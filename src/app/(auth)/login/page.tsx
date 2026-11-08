import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Masuk untuk mengelola kos atau melihat tagihan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm next={next} />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline"
          >
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
