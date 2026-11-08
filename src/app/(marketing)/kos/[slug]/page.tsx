import { BedDouble, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomCard } from "@/features/rooms/components/room-card";
import { getPublicKosBySlug } from "@/features/kos/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type KosDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: KosDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kos = await getPublicKosBySlug(slug);

  if (!kos) {
    return { title: "Kos tidak ditemukan" };
  }

  return {
    title: kos.name,
    description:
      kos.description ??
      `Informasi kamar dan harga di ${kos.name}.`,
  };
}

export default async function KosDetailPage({ params }: KosDetailPageProps) {
  const { slug } = await params;
  const kos = await getPublicKosBySlug(slug);

  if (!kos) {
    notFound();
  }

  const availableRooms = kos.rooms.filter(
    (room) => room.status === "AVAILABLE",
  );
  const location = formatAddress([kos.city, kos.province]);
  const address = formatAddress([kos.address, location]);

  const whatsapp = kos.whatsapp?.replace(/\D/g, "").replace(/^0/, "62");
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;
  const phoneLink = kos.phone ? `tel:${kos.phone.replace(/\s/g, "")}` : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{kos.name}</h1>
        {kos.description ? (
          <p className="mt-3 text-muted-foreground">{kos.description}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {address ? (
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {address}
            </span>
          ) : null}
          {kos.priceFrom ? (
            <span>Mulai {formatCurrency(kos.priceFrom)} / bulan</span>
          ) : null}
        </div>

        {whatsappLink || phoneLink ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            ) : null}
            {phoneLink ? (
              <a
                href={phoneLink}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Phone className="size-4" />
                Telepon
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Daftar kamar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {availableRooms.length} dari {kos.rooms.length} kamar tersedia.
          </p>
        </div>
      </div>

      {kos.rooms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kos.rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              href={`/kos/${kos.slug}/rooms/${room.id}`}
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
              Hubungi pengelola untuk informasi ketersediaan kamar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
