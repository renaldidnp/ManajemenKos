import Link from "next/link";
import {
  BedDouble,
  Bot,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";

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

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" />
            Hunian nyaman, pengelolaan modern
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Cari kos jadi mudah, kelola kos jadi rapi.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Landing page, manajemen kos, booking online, dan chatbot dalam satu
            platform.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/kos"
              className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Lihat kamar
            </Link>
            <Link
              href="/register"
              className="rounded-md border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Daftar sebagai penghuni
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 transition-colors hover:bg-muted/40"
            >
              <feature.icon className="mb-4 size-6" />
              <h2 className="mb-2 font-medium">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/40">
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
