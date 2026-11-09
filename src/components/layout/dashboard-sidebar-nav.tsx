"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav, tenantNav } from "@/config/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, rootHref: string) {
  return (
    pathname === href ||
    (href !== rootHref && pathname.startsWith(`${href}/`))
  );
}

export function DashboardSidebarNav({ role }: { role: "admin" | "tenant" }) {
  const pathname = usePathname();
  const nav = role === "admin" ? adminNav : tenantNav;
  const rootHref = role === "admin" ? "/admin" : "/tenant";

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigasi utama">
      {nav.map((item) => {
        const active = isActive(pathname, item.href, rootHref);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-4",
                active
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
