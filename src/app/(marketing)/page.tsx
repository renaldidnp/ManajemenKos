import {
  ArrowRight,
  BedDouble,
  BedSingle,
  BadgeCheck,
  CalendarCheck,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Dumbbell,
  Fan,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Shirt,
  Snowflake,
  Sparkles,
  Tv,
  Users,
  Utensils,
  WashingMachine,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { RoomCard } from "@/features/rooms/components/room-card";
import { getPublicKos } from "@/features/kos/server/queries";
import { formatAddress, formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Pencarian mudah",
    description:
      "Temukan kamar berdasarkan lokasi, harga, dan fasilitas dalam hitungan detik.",
  },
  {
    icon: CalendarCheck,
    title: "Booking online",
    description:
      "Ajukan sewa tanpa perlu datang. Cek ketersediaan kamar secara real-time.",
  },
  {
    icon: MessageCircle,
    title: "Asisten AI",
    description:
      "Tanya apa saja seputar kos dan dapatkan jawaban cepat kapan pun.",
  },
  {
    icon: ShieldCheck,
    title: "Data terverifikasi",
    description:
      "Informasi kamar, harga, dan fasilitas dikelola langsung oleh pemilik kos.",
  },
];

const faqs = [
  {
    question: "Bagaimana cara mencari kamar yang tersedia?",
    answer:
      "Gunakan kolom pencarian di halaman utama atau buka halaman Kamar. Anda bisa memfilter kamar berdasarkan nama kamar, fasilitas, dan harga maksimum.",
  },
  {
    question: "Apakah bisa melakukan booking tanpa datang ke lokasi?",
    answer:
      "Bisa. Pilih kamar yang diinginkan, lalu ajukan booking secara online. Pengelola akan menghubungi Anda untuk konfirmasi jadwal masuk.",
  },
  {
    question: "Bagaimana cara menghubungi pengelola kos?",
    answer:
      "Hubungi pengelola melalui tombol WhatsApp yang tersedia di halaman detail kos atau kamar. Anda juga bisa mendaftar akun untuk mengelola booking.",
  },
  {
    question: "Apakah harga sudah termasuk fasilitas?",
    answer:
      "Harga yang ditampilkan adalah harga sewa per bulan. Fasilitas setiap kamar tercantum di halaman detail kamar agar Anda bisa membandingkan dengan mudah.",
  },
];

const priceOptions = [500000, 750000, 1000000, 1500000, 2000000];

function getFacilityIcon(facility: string): LucideIcon {
  const key = facility.toLowerCase();

  if (key.includes("wifi") || key.includes("internet")) return Wifi;
  if (key.includes("ac") || key.includes("pendingin")) return Snowflake;
  if (key.includes("kipas")) return Fan;
  if (key.includes("kasur") || key.includes("bed")) return BedDouble;
  if (key.includes("lemari") || key.includes("pakaian")) return Shirt;
  if (key.includes("dapur") || key.includes("masak")) return Utensils;
  if (key.includes("parkir")) return Car;
  if (key.includes("cuci")) return WashingMachine;
  if (key.includes("tv")) return Tv;
  if (key.includes("olahraga") || key.includes("gym")) return Dumbbell;

  return Check;
}

export default async function HomePage() {
  const kos = await getPublicKos();

  const rooms = kos?.rooms ?? [];
  const availableRooms = rooms.filter((room) => room.status === "AVAILABLE");
  const featuredRooms = (availableRooms.length > 0 ? availableRooms : rooms).slice(
    0,
    3,
  );
  const lowestPrice =
    kos?.priceFrom ??
    (rooms.length > 0
      ? Math.min(...rooms.map((room) => room.priceMonthly))
      : null);

  const location = formatAddress([kos?.city, kos?.province]);
  const address = formatAddress([kos?.address, location]);

  const whatsapp = kos?.whatsapp?.replace(/\D/g, "").replace(/^0/, "62");
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;

  const facilities = Array.from(
    new Set(rooms.flatMap((room) => room.facilities)),
  ).slice(0, 8);

  const singleRooms = availableRooms.filter(
    (room) => room.capacity <= 1,
  ).length;
  const sharingRooms = availableRooms.filter(
    (room) => room.capacity > 1,
  ).length;

  const categories = [
    {
      icon: BedSingle,
      title: "Kamar single",
      description: "Nyaman untuk tinggal sendiri",
      count: singleRooms,
    },
    {
      icon: Users,
      title: "Kamar sharing",
      description: "Lebih hemat untuk dua orang",
      count: sharingRooms,
    },
    {
      icon: BadgeCheck,
      title: "Siap huni",
      description: "Kamar tersedia saat ini",
      count: availableRooms.length,
    },
  ];

  const popularSearches = [
    { label: "Semua kamar", href: "/kos" },
    ...facilities.slice(0, 3).map((facility) => ({
      label: facility,
      href: `/kos?q=${encodeURIComponent(facility)}`,
    })),
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-emerald-600 text-white">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-72 rounded-full bg-emerald-400/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 size-80 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-24 md:pt-20 md:pb-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur">
              <BadgeCheck className="size-3.5" />
              Dikelola langsung oleh pemilik, tanpa perantara
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Cari Kamar Idaman?
              <br />
              <span className="text-emerald-100">
                Di {siteConfig.name} Aja!
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-emerald-50/90">
              {kos?.description ??
                "Temukan kamar kos nyaman, ajukan sewa online, dan kelola kos dalam satu tempat."}
            </p>

            {address ? (
              <p className="mt-4 inline-flex items-start gap-2 text-sm text-emerald-50/90">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {address}
              </p>
            ) : null}
          </div>

          <form
            action="/kos"
            method="get"
            className="mt-8 rounded-2xl bg-background p-2 shadow-2xl md:mt-10"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  placeholder="Cari tipe kamar atau fasilitas"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border-0 bg-transparent pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                />
              </div>

              <div className="hidden h-8 w-px bg-border md:block" />

              <select
                name="maxPrice"
                aria-label="Harga maksimum"
                className="h-12 rounded-xl border-0 bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                defaultValue=""
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none"
              >
                <Search className="size-4" />
                Cari Kamar
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-emerald-100/80">Pencarian cepat:</span>
            {popularSearches.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-emerald-50 transition-colors hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 w-full max-w-5xl px-4">
        <dl className="grid grid-cols-3 divide-x overflow-hidden rounded-2xl border bg-background shadow-lg">
          <div className="px-3 py-5 text-center md:px-6">
            <dt className="text-xs text-muted-foreground md:text-sm">
              Kamar tersedia
            </dt>
            <dd className="mt-1 text-xl font-bold text-emerald-700 md:text-2xl dark:text-emerald-400">
              {availableRooms.length}
            </dd>
          </div>
          <div className="px-3 py-5 text-center md:px-6">
            <dt className="text-xs text-muted-foreground md:text-sm">
              Total kamar
            </dt>
            <dd className="mt-1 text-xl font-bold md:text-2xl">
              {rooms.length}
            </dd>
          </div>
          <div className="px-3 py-5 text-center md:px-6">
            <dt className="text-xs text-muted-foreground md:text-sm">
              Mulai dari
            </dt>
            <dd className="mt-1 text-xl font-bold text-emerald-700 md:text-2xl dark:text-emerald-400">
              {lowestPrice ? formatCurrency(lowestPrice) : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Rekomendasi
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Kamar pilihan untukmu
            </h2>
            <p className="mt-2 text-muted-foreground">
              Kamar terbaik di {kos?.name ?? siteConfig.name} yang siap kamu tempati.
            </p>
          </div>
          <Link
            href="/kos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400"
          >
            Lihat semua kamar
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {featuredRooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                href={kos ? `/kos/${kos.slug}/rooms/${room.id}` : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
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

      <section className="border-y bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Pilihan tipe
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Temukan kamar sesuai kebutuhan
            </h2>
            <p className="mt-2 text-muted-foreground">
              Dari kamar single hingga sharing, pilih yang paling pas untukmu.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href="/kos"
                className="group flex items-center gap-4 rounded-2xl border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-md"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <category.icon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {category.count} kamar
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="fasilitas"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 md:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Fasilitas
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Fasilitas yang bikin betah
          </h2>
          <p className="mt-2 text-muted-foreground">
            Semua yang kamu butuhkan untuk tinggal dengan nyaman.
          </p>
        </div>

        {facilities.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {facilities.map((facility) => {
              const Icon = getFacilityIcon(facility);

              return (
                <div
                  key={facility}
                  className="flex items-center gap-3 rounded-xl border bg-background p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{facility}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Informasi fasilitas akan tampil setelah ditambahkan oleh pengelola.
          </p>
        )}
      </section>

      <section className="bg-emerald-600 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-emerald-100">
              Kenapa {siteConfig.name}?
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Pengalaman cari kos yang lebih mudah
            </h2>
            <p className="mt-2 text-emerald-50/90">
              Dari pencarian sampai pengelolaan sewa, semuanya dalam satu
              platform.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title}>
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-emerald-50/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="lokasi"
        className="mx-auto grid w-full max-w-6xl scroll-mt-20 gap-6 px-4 py-16 md:grid-cols-2 md:py-20"
      >
        <div className="rounded-3xl border bg-muted/30 p-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-background text-emerald-700 dark:text-emerald-400">
            <MapPin className="size-5" />
          </span>
          <h2 className="mt-4 text-xl font-bold tracking-tight">
            {location ? `Lokasi strategis di ${location}` : "Lokasi strategis"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {address ??
              "Kos berada dekat dengan kampus, tempat kerja, dan pusat perbelanjaan."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[kos?.city, kos?.province, kos?.postalCode]
              .filter(Boolean)
              .map((item) => (
                <span
                  key={item}
                  className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
          </div>

          <Link
            href="/kos"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400"
          >
            Lihat semua kamar
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-white">
          <div
            aria-hidden
            className="absolute -top-16 -right-10 size-48 rounded-full bg-emerald-400/30 blur-3xl"
          />
          <span className="relative flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5" />
          </span>
          <h2 className="relative mt-4 text-xl font-bold tracking-tight">
            Butuh bantuan memilih?
          </h2>
          <p className="relative mt-2 max-w-sm text-sm text-emerald-50/90">
            Tim pengelola siap membantu kamu menemukan kamar yang paling sesuai
            dengan kebutuhan dan budget.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                <MessageCircle className="size-4" />
                Chat WhatsApp
              </a>
            ) : null}
            <Link
              href="/kos"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Lihat kamar
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 md:py-20">
          <div className="text-center">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              FAQ
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Pertanyaan yang sering diajukan
            </h2>
            <p className="mt-2 text-muted-foreground">
              Belum menemukan jawaban? Hubungi pengelola kos.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border bg-background p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col items-center gap-4 rounded-3xl border bg-background p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Siap pindah ke kos baru?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Cek ketersediaan kamar dan ajukan sewa dalam hitungan menit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/kos"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Lihat kamar
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Daftar sebagai penghuni
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
