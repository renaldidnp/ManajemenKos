"use client";

import { UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleTenantStatus } from "@/features/tenants/server/actions";

type ToggleTenantStatusButtonProps = {
  tenantId: string;
  status: "ACTIVE" | "INACTIVE";
};

export function ToggleTenantStatusButton({
  tenantId,
  status,
}: ToggleTenantStatusButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = status === "ACTIVE";

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleTenantStatus(tenantId);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        result.data.status === "ACTIVE"
          ? "Penghuni diaktifkan."
          : "Penghuni dinonaktifkan.",
      );
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isActive ? "Nonaktifkan penghuni" : "Aktifkan penghuni"}
      title={isActive ? "Nonaktifkan penghuni" : "Aktifkan penghuni"}
    >
      {isActive ? (
        <UserX className="size-4 text-muted-foreground" />
      ) : (
        <UserCheck className="size-4 text-emerald-600" />
      )}
    </Button>
  );
}
