import { BedDouble, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RoomCard } from "@/features/rooms/components/room-card";
import { getPublicKos } from "@/features/kos/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kamar",
};

export default async function KosListPage() {
  const kos = await getPublicKos();
  const rooms = kos?.rooms ?? [];
  const location = formatAddress([kos?.city, kos?.province]);
  const address = formatAddress([kos?.address, location]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {kos ? `Kamar di ${kos.name}` : "Daftar kamar"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {kos?.description ??
            "Katalog kamar akan tampil di sini setelah data diisi."}
        </p>
        {address ? (
          <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {address}
          </p>
        ) : null}
        {kos?.priceFrom ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Harga mulai {formatCurrency(kos.priceFrom)} per bulan.
          </p>
        ) : null}
      </div>

      {rooms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              href={kos ? `/kos/${kos.slug}/rooms/${room.id}` : undefined}
              showStatus
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <BedDouble className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium">Belum ada kamar</p>
            <p className="text-sm text-muted-foreground">
              Kamar akan tampil di sini setelah ditambahkan oleh pengelola.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium underline underline-offset-4"
          >
            Kembali ke beranda
          </Link>
        </div>
      )}
    </div>
  );
}
