import Link from "next/link";
import { adminNav, tenantNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Admin
          </p>
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          ))}

          <p className="mt-4 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Penghuni
          </p>
          {tenantNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6">
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
