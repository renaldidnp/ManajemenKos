import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatTone = "emerald" | "sky" | "amber" | "rose" | "violet";

const toneClasses: Record<StatTone, string> = {
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  violet:
    "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
};

type StatCardProps = {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: StatTone;
  href?: string;
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "emerald",
  href,
}: StatCardProps) {
  const card = (
    <Card className="h-full gap-0 py-0 shadow-sm transition-all group-hover:border-emerald-600/30 group-hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="group block h-full">
      {card}
    </Link>
  );
}
