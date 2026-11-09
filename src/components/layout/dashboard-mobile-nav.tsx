"use client";

import { Menu } from "lucide-react";
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
  return pathname === href || (href !== rootHref && pathname.startsWith(`${href}/`));
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
        <SheetHeader className="h-16 flex-row items-center gap-2 border-b px-6 py-0 pr-12">
          <SheetTitle className="text-base tracking-tight">
            {siteConfig.name}
          </SheetTitle>
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {role === "admin" ? "Admin" : "Penghuni"}
          </span>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground",
                isActive(pathname, item.href, rootHref)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Kembali ke situs
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
