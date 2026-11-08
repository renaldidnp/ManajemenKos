import { requireTenant } from "@/lib/session";

export default async function TenantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireTenant();
  return children;
}
