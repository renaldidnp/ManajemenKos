import { BedDouble, MapPin, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RoomCard } from "@/features/rooms/components/room-card";
import { getPublicKos } from "@/features/kos/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kamar",
};

const priceOptions = [500000, 750000, 1000000, 1500000, 2000000];

type KosListPageProps = {
  searchParams: Promise<{ q?: string; maxPrice?: string }>;
};

function matches(value: string | null | undefined, query: string) {
  return value?.toLowerCase().includes(query) ?? false;
}

export default async function KosListPage({ searchParams }: KosListPageProps) {
  const { q = "", maxPrice } = await searchParams;
  const query = q.trim();
  const normalizedQuery = query.toLowerCase();

  const parsedMaxPrice = Number(maxPrice);
  const maxPriceValue =
    Number.isFinite(parsedMaxPrice) && parsedMaxPrice > 0
      ? parsedMaxPrice
      : null;

  const kos = await getPublicKos();
  const rooms = kos?.rooms ?? [];
  const location = formatAddress([kos?.city, kos?.province]);
  const address = formatAddress([kos?.address, location]);

  const locationMatches =
    normalizedQuery.length > 0 &&
    [kos?.name, kos?.city, kos?.province, kos?.address].some((value) =>
      matches(value, normalizedQuery),
    );

  const filteredRooms = rooms.filter((room) => {
    const roomMatches =
      normalizedQuery.length === 0 ||
      [room.number, room.name, room.description, ...room.facilities].some(
        (value) => matches(value, normalizedQuery),
      );
    const queryMatches = normalizedQuery.length === 0 || locationMatches || roomMatches;
    const priceMatches = !maxPriceValue || room.priceMonthly <= maxPriceValue;

    return queryMatches && priceMatches;
  });

  const isFiltered = query.length > 0 || maxPriceValue !== null;

  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Kamar
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            {kos ? `Kamar di ${kos.name}` : "Daftar kamar"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {kos?.description ??
              "Katalog kamar akan tampil di sini setelah data diisi."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {address ? (
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {address}
              </span>
            ) : null}
            {kos?.priceFrom ? (
              <span>Mulai {formatCurrency(kos.priceFrom)} / bulan</span>
            ) : null}
          </div>

          <form
            action="/kos"
            method="get"
            className="mt-6 rounded-2xl border bg-background p-2 shadow-sm"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Cari tipe kamar atau fasilitas"
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border-0 bg-transparent pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                />
              </div>

              <div className="hidden h-8 w-px bg-border md:block" />

              <select
                name="maxPrice"
                aria-label="Harga maksimum"
                defaultValue={maxPriceValue ?? ""}
                className="h-11 rounded-xl border-0 bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <option value="">Semua harga</option>
                {priceOptions.map((price) => (
                  <option key={price} value={price}>
                    Maks. {formatCurrency(price)}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none"
              >
                <Search className="size-4" />
                Cari
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filteredRooms.length}
            </span>{" "}
            kamar ditemukan
            {query ? ` untuk "${query}"` : ""}
            {maxPriceValue ? ` dengan harga maks. ${formatCurrency(maxPriceValue)}` : ""}.
          </p>
          {isFiltered ? (
            <Link
              href="/kos"
              className="text-sm font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-400"
            >
              Reset pencarian
            </Link>
          ) : null}
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                href={kos ? `/kos/${kos.slug}/rooms/${room.id}` : undefined}
                showStatus
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
            <BedDouble className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {isFiltered ? "Tidak ada kamar yang cocok" : "Belum ada kamar"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isFiltered
                  ? "Coba ubah kata kunci atau harga maksimum pencarianmu."
                  : "Kamar akan tampil di sini setelah ditambahkan oleh pengelola."}
              </p>
            </div>
            <Link
              href={isFiltered ? "/kos" : "/"}
              className="text-sm font-medium underline underline-offset-4"
            >
              {isFiltered ? "Lihat semua kamar" : "Kembali ke beranda"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
