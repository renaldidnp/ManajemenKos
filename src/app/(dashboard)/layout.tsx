import Link from "next/link";
import { adminNav, tenantNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { UserMenu } from "@/features/auth/components/user-menu";
import { getRole, requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireSession("/");
  const role = getRole(session);
  const nav = role === "admin" ? adminNav : tenantNav;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {role === "admin" ? "Admin" : "Penghuni"}
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
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
        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Kembali ke situs
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-sm font-medium">Dashboard</span>
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
