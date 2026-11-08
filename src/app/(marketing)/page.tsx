import {
  ArrowRight,
  BedDouble,
  Bot,
  CalendarCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { RoomCard } from "@/features/rooms/components/room-card";
import { getPublicKos } from "@/features/kos/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: BedDouble,
    title: "Kamar nyaman",
    description:
      "Lihat detail kamar, fasilitas, dan harga secara transparan sebelum memesan.",
  },
  {
    icon: CalendarCheck,
    title: "Booking online",
    description:
      "Ajukan sewa tanpa perlu datang. Cek ketersediaan kamar secara real-time.",
  },
  {
    icon: Bot,
    title: "Asisten AI",
    description:
      "Tanya apa saja seputar kos dan dapatkan jawaban cepat kapan pun.",
  },
  {
    icon: ShieldCheck,
    title: "Pengelolaan rapi",
    description:
      "Data penghuni, tagihan, dan status sewa terkelola dalam satu dashboard.",
  },
];

export default async function HomePage() {
  const kos = await getPublicKos();

  const rooms = kos?.rooms ?? [];
  const availableRooms = rooms.filter((room) => room.status === "AVAILABLE");
  const featuredRooms = availableRooms.slice(0, 3);
  const lowestPrice =
    kos?.priceFrom ??
    (rooms.length > 0
      ? Math.min(...rooms.map((room) => room.priceMonthly))
      : null);

  const location = formatAddress([kos?.city, kos?.province]);
  const address = formatAddress([kos?.address, location]);

  const whatsapp = kos?.whatsapp?.replace(/\D/g, "").replace(/^0/, "62");
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;

  return (
    <>
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {location ? (
              <>
                <MapPin className="size-3.5" />
                {location}
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Hunian nyaman, pengelolaan modern
              </>
            )}
          </span>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            {kos?.name ?? "Cari kos jadi mudah, kelola kos jadi rapi."}
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            {kos?.description ??
              "Landing page, manajemen kos, booking online, dan chatbot dalam satu platform."}
          </p>

          {address ? (
            <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {address}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/kos"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Lihat kamar
              <ArrowRight className="size-4" />
            </Link>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <MessageCircle className="size-4" />
                Hubungi via WhatsApp
              </a>
            ) : (
              <Link
                href="/register"
                className="rounded-md border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Daftar sebagai penghuni
              </Link>
            )}
          </div>

          {kos ? (
            <dl className="mt-4 grid w-full max-w-2xl grid-cols-3 gap-4 border-t pt-6">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Kamar tersedia
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {availableRooms.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Total kamar</dt>
                <dd className="mt-1 text-2xl font-semibold">{rooms.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Mulai dari</dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {lowestPrice ? formatCurrency(lowestPrice) : "—"}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Kamar tersedia
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pilih kamar yang sesuai kebutuhan Anda.
            </p>
          </div>
          <Link
            href="/kos"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Lihat semua
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {featuredRooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                href={`/kos/${kos?.slug}/rooms/${room.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
            <BedDouble className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Belum ada kamar tersedia</p>
              <p className="text-sm text-muted-foreground">
                Silakan hubungi pengelola untuk informasi ketersediaan kamar.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-background p-6"
              >
                <feature.icon className="mb-4 size-6" />
                <h2 className="mb-2 font-medium">{feature.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center">
          <Wifi className="size-8 text-muted-foreground" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Siap pindah ke kos baru?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Cek ketersediaan kamar dan ajukan sewa dalam hitungan menit.
          </p>
          <Link
            href="/kos"
            className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Mulai sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
