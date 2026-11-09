import { Home } from "lucide-react";
import Link from "next/link";
import { MarketingMobileNav } from "@/components/layout/marketing-mobile-nav";
import { siteConfig } from "@/config/site";
import { UserMenu } from "@/features/auth/components/user-menu";

const footerLinks = [
  {
    title: "Jelajahi",
    items: [
      { title: "Kamar", href: "/kos" },
      { title: "Fasilitas", href: "/#fasilitas" },
      { title: "Lokasi", href: "/#lokasi" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Akun",
    items: [
      { title: "Masuk", href: "/login" },
      { title: "Daftar", href: "/register" },
      { title: "Dashboard", href: "/admin" },
    ],
  },
  {
    title: "Bantuan",
    items: [
      { title: "Pusat Bantuan", href: "/faq" },
      { title: "Hubungi Pengelola", href: "/faq" },
      { title: "Kebijakan Privasi", href: "/faq" },
    ],
  },
];

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Home className="size-4" />
              </span>
              <span className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                {siteConfig.name}
              </span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link
                href="/kos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Kamar
              </Link>
              <Link
                href="/#fasilitas"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Fasilitas
              </Link>
              <Link
                href="/#lokasi"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Lokasi
              </Link>
              <Link
                href="/faq"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/faq"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:block"
            >
              Pusat Bantuan
            </Link>
            <MarketingMobileNav />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-900 text-neutral-300">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Home className="size-4" />
                </span>
                <span className="text-lg font-bold tracking-tight text-white">
                  {siteConfig.name}
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-neutral-400">
                {siteConfig.description}
              </p>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-neutral-400 transition-colors hover:text-white"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-neutral-800 pt-6 text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Semua hak
            dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
