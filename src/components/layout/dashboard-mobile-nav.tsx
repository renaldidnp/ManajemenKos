"use client";

import { ArrowLeft, Building2, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { adminNav, tenantNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, rootHref: string) {
  return (
    pathname === href ||
    (href !== rootHref && pathname.startsWith(`${href}/`))
  );
}

export function DashboardMobileNav({ role }: { role: "admin" | "tenant" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = role === "admin" ? adminNav : tenantNav;
  const rootHref = role === "admin" ? "/admin" : "/tenant";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Buka menu navigasi</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="h-16 flex-row items-center gap-3 border-b px-5 py-0 pr-12">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Building2 className="size-5" />
          </span>
          <SheetTitle className="text-base tracking-tight">
            {siteConfig.name}
          </SheetTitle>
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {role === "admin" ? "Admin" : "Penghuni"}
          </span>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = isActive(pathname, item.href, rootHref);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
        <div className="border-t p-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke situs
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
