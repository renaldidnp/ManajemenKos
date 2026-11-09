import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { DashboardHeaderTitle } from "@/components/layout/dashboard-header-title";
import { DashboardMobileNav } from "@/components/layout/dashboard-mobile-nav";
import { DashboardSidebarNav } from "@/components/layout/dashboard-sidebar-nav";
import { siteConfig } from "@/config/site";
import { UserMenu } from "@/features/auth/components/user-menu";
import { getRole, requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireSession("/");
  const role = getRole(session);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Building2 className="size-5" />
          </span>
          <div className="min-w-0">
            <Link
              href="/"
              className="block truncate font-semibold tracking-tight"
            >
              {siteConfig.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {role === "admin" ? "Panel pengelola" : "Area penghuni"}
            </p>
          </div>
        </div>
        <DashboardSidebarNav role={role} />
        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke situs
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-2">
            <DashboardMobileNav role={role} />
            <DashboardHeaderTitle role={role} />
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
