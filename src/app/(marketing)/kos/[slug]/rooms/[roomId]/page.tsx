import {
  ArrowLeft,
  BedDouble,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { roomStatusLabels } from "@/features/rooms/schemas";
import { getPublicRoom } from "@/features/rooms/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type RoomDetailPageProps = {
  params: Promise<{ slug: string; roomId: string }>;
};

export async function generateMetadata({
  params,
}: RoomDetailPageProps): Promise<Metadata> {
  const { roomId } = await params;
  const room = await getPublicRoom(roomId);

  if (!room) {
    return { title: "Kamar tidak ditemukan" };
  }

  return {
    title: `Kamar ${room.number} - ${room.kos.name}`,
    description:
      room.description ??
      `Informasi kamar ${room.number} di ${room.kos.name}.`,
  };
}

export default async function RoomDetailPage({
  params,
}: RoomDetailPageProps) {
  const { slug, roomId } = await params;
  const room = await getPublicRoom(roomId);

  if (!room || room.kos.slug !== slug) {
    notFound();
  }

  const location = formatAddress([room.kos.city, room.kos.province]);
  const whatsapp = room.kos.whatsapp?.replace(/\D/g, "").replace(/^0/, "62");
  const message = `Halo, saya tertarik dengan kamar ${room.number} di ${room.kos.name}.`;
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
    : null;
  const phoneLink = room.kos.phone
    ? `tel:${room.kos.phone.replace(/\s/g, "")}`
    : null;
  const title = room.name
    ? `Kamar ${room.number} · ${room.name}`
    : `Kamar ${room.number}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Link
        href={`/kos/${room.kos.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke {room.kos.name}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {title}
              </h1>
              <Badge
                variant={
                  room.status === "AVAILABLE"
                    ? "default"
                    : room.status === "OCCUPIED"
                      ? "secondary"
                      : "destructive"
                }
              >
                {roomStatusLabels[room.status]}
              </Badge>
            </div>
            <p className="mt-3 text-2xl font-semibold">
              {formatCurrency(room.priceMonthly)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / bulan
              </span>
            </p>
          </div>

          {room.images.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {room.images.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? `Foto kamar ${room.number} ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-xl border bg-muted">
              <BedDouble className="size-12 text-muted-foreground" />
            </div>
          )}

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Deskripsi kamar
            </h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">
              {room.description ||
                "Pengelola belum menambahkan deskripsi untuk kamar ini."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">Fasilitas</h2>
            {room.facilities.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {room.facilities.map((facility) => (
                  <Badge key={facility} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-muted-foreground">
                Belum ada informasi fasilitas.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="space-y-5 rounded-xl border p-6">
            <div>
              <p className="text-sm font-medium">Detail kamar</p>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4" />
                    Kapasitas
                  </dt>
                  <dd>{room.capacity} orang</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="size-4" />
                    Ukuran
                  </dt>
                  <dd>{room.size ?? "—"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    Lokasi
                  </dt>
                  <dd className="text-right">
                    {formatAddress([room.kos.address, location]) || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {room.status !== "AVAILABLE" ? (
              <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                Kamar ini sedang tidak tersedia. Hubungi pengelola untuk
                ketersediaan berikutnya.
              </p>
            ) : null}

            <div className="space-y-2">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="size-4" />
                  Tanya kamar ini
                </a>
              ) : null}
              {phoneLink ? (
                <a
                  href={phoneLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Phone className="size-4" />
                  Telepon pengelola
                </a>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
