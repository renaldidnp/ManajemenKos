import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/kos" className="transition-colors hover:text-foreground">
              Kamar
            </Link>
            <Link href="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
