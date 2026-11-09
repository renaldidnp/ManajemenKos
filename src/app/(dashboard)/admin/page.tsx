import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Plus,
  ReceiptText,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  bookingStatusLabels,
  bookingStatusVariants,
} from "@/features/bookings/status";
import {
  invoiceStatusLabels,
  invoiceStatusVariants,
} from "@/features/billing/status";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getAdminDashboardData } from "@/features/dashboard/server/queries";
import { formatCurrency, formatDate, formatLongDate } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      {href && actionLabel ? (
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const data = await getAdminDashboardData();

  const firstName = session.user.name.split(" ")[0] || "Admin";
  const occupancyRate =
    data.rooms.total > 0
      ? Math.round((data.rooms.occupied / data.rooms.total) * 100)
      : 0;
  const paidRate =
    data.invoices.totalAmount > 0
      ? Math.round(
          (data.invoices.paidAmount / data.invoices.totalAmount) * 100,
        )
      : 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 px-6 py-8 text-white shadow-sm sm:px-8">
        <div
          aria-hidden
          className="absolute -top-20 -right-16 size-56 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-10 size-64 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur">
              <Sparkles className="size-3.5" />
              Dashboard pengelola
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Halo, {firstName}
            </h1>
            <p className="mt-2 text-sm text-emerald-50/90 sm:text-base">
              Berikut ringkasan hunian, booking, dan tagihan KosKita hari ini.
              Semua yang perlu ditindaklanjuti ada di satu tempat.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-50/80">
              <CalendarDays className="size-4" />
              {formatLongDate(new Date())}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Link href="/admin/rooms/new">
                <Plus className="size-4" />
                Tambah kamar
              </Link>
            </Button>
            <Button
              asChild
              className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/admin/tenants/new">
                <UserPlus className="size-4" />
                Tambah penghuni
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kamar terisi"
          value={`${data.rooms.occupied}/${data.rooms.total}`}
          hint={`${occupancyRate}% tingkat hunian`}
          icon={BedDouble}
          tone="emerald"
          href="/admin/rooms"
        />
        <StatCard
          label="Penghuni aktif"
          value={data.tenants.active}
          hint={`${data.tenants.total} penghuni terdaftar`}
          icon={Users}
          tone="sky"
          href="/admin/tenants"
        />
        <StatCard
          label="Booking menunggu"
          value={data.bookings.pending}
          hint={`${data.bookings.confirmed} booking dikonfirmasi`}
          icon={CalendarClock}
          tone="amber"
          href="/admin/bookings"
        />
        <StatCard
          label="Tagihan belum dibayar"
          value={data.invoices.unpaid}
          hint={`${formatCurrency(data.invoices.outstandingAmount)} tertagih`}
          icon={ReceiptText}
          tone="rose"
          href="/admin/bills"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Tingkat hunian</CardTitle>
              <CardDescription>
                Pantau ketersediaan kamar secara sekilas.
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            >
              {occupancyRate}% terisi
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.rooms.total === 0 ? (
              <EmptyState
                icon={BedDouble}
                title="Belum ada kamar"
                description="Tambahkan kamar pertama agar data hunian mulai terlihat di sini."
                href="/admin/rooms/new"
                actionLabel="Tambah kamar"
              />
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {data.rooms.occupied}
                      <span className="text-lg font-normal text-muted-foreground">
                        {" "}
                        / {data.rooms.total} kamar
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.rooms.available} kamar siap disewakan
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/rooms">
                      Kelola kamar
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Terisi {data.rooms.occupied}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-sky-500" />
                      Tersedia {data.rooms.available}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500" />
                      Perbaikan {data.rooms.maintenance}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tagihan</CardTitle>
            <CardDescription>Ringkasan pembayaran sewa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {formatCurrency(data.invoices.outstandingAmount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Belum dibayar dari {data.invoices.unpaid} tagihan
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Terbayar</p>
                <p className="mt-1 font-medium">
                  {formatCurrency(data.invoices.paidAmount)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Total tagihan</p>
                <p className="mt-1 font-medium">
                  {formatCurrency(data.invoices.totalAmount)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${paidRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {paidRate}% dari total tagihan sudah terbayar
              </p>
            </div>

            {data.invoices.overdue > 0 ? (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>
                  {data.invoices.overdue} tagihan sudah melewati jatuh tempo.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                Tidak ada tagihan yang terlambat.
              </div>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/bills">
                Lihat semua tagihan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Booking terbaru</CardTitle>
              <CardDescription>
                Pengajuan sewa terakhir dari calon penghuni.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/bookings">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentBookings.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Belum ada booking"
                description="Pengajuan sewa dari calon penghuni akan muncul di sini."
                href="/admin/bookings"
                actionLabel="Lihat booking"
              />
            ) : (
              <div className="divide-y">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {booking.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {booking.room
                          ? `Kamar ${booking.room.number}`
                          : "Kamar belum dipilih"}{" "}
                        · Masuk {formatDate(booking.moveInDate)}
                      </p>
                    </div>
                    <Badge
                      variant={bookingStatusVariants[booking.status]}
                      className="shrink-0"
                    >
                      {bookingStatusLabels[booking.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Perlu perhatian</CardTitle>
              <CardDescription>
                Tagihan yang belum dibayar atau sudah terlambat.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/bills">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.attentionInvoices.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Semua tagihan aman"
                description="Tidak ada tagihan yang perlu ditindaklanjuti saat ini."
              />
            ) : (
              <div className="divide-y">
                {data.attentionInvoices.map((invoice) => {
                  const tenantName =
                    invoice.tenant?.name ?? invoice.booking?.name ?? "Tanpa nama";
                  const roomNumber = invoice.booking?.room?.number;

                  return (
                    <div
                      key={invoice.id}
                      className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {tenantName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {invoice.number}
                          {roomNumber ? ` · Kamar ${roomNumber}` : ""} · Jatuh
                          tempo {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <Badge
                          variant={invoiceStatusVariants[invoice.status]}
                          className="mt-1"
                        >
                          {invoiceStatusLabels[invoice.status]}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
