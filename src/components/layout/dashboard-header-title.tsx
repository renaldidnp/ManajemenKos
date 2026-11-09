"use client";

import { usePathname } from "next/navigation";
import { adminNav, tenantNav } from "@/config/nav";

export function DashboardHeaderTitle({
  role,
}: {
  role: "admin" | "tenant";
}) {
  const pathname = usePathname();
  const nav = role === "admin" ? adminNav : tenantNav;
  const rootHref = role === "admin" ? "/admin" : "/tenant";

  const active = nav
    .filter(
      (item) =>
        item.href === rootHref ||
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <span className="text-sm font-medium">{active?.title ?? "Dashboard"}</span>
  );
}
