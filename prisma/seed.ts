import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  appName: "Kos",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

async function seedKos() {
  const kos = await prisma.kos.upsert({
    where: { slug: "kos-melati" },
    update: {},
    create: {
      name: "Kos Melati",
      slug: "kos-melati",
      description:
        "Kos putri yang nyaman, bersih, dan dekat dengan kampus serta pusat perbelanjaan.",
      address: "Jl. Melati No. 10",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40123",
      phone: "081234567890",
      whatsapp: "081234567890",
      priceFrom: 750000,
    },
  });

  const rooms = [
    {
      number: "A1",
      priceMonthly: 750000,
      size: "3x3 m",
      capacity: 1,
      description:
        "Kamar single dengan kasur nyaman, lemari, kipas angin, dan WiFi. Cocok untuk mahasiswa yang butuh ruang tenang.",
    },
    {
      number: "A2",
      priceMonthly: 850000,
      size: "3x3.5 m",
      capacity: 1,
      description:
        "Kamar single yang sedikit lebih luas dengan sirkulasi udara baik, dilengkapi kasur, lemari, kipas angin, dan WiFi.",
    },
    {
      number: "B1",
      priceMonthly: 1200000,
      size: "4x4 m",
      capacity: 2,
      description:
        "Kamar sharing untuk 2 orang dengan ruang lebih lega, cocok untuk teman atau pasangan.",
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: {
        kosId_number: { kosId: kos.id, number: room.number },
      },
      update: {},
      create: {
        ...room,
        kosId: kos.id,
        facilities: ["Kasur", "Lemari", "Kipas angin", "WiFi"],
      },
    });
  }

  console.log(`Seeded kos "${kos.name}" with ${rooms.length} rooms.`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Admin Kos";

  if (!email || !password) {
    console.warn(
      "Lewati pembuatan admin: SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD belum diisi.",
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role !== "admin") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "admin" },
      });
    }
    console.log(`Admin "${email}" sudah ada.`);
    return;
  }

  await auth.api.signUpEmail({
    body: { name, email, password },
  });

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`Admin "${email}" berhasil dibuat.`);
}

async function main() {
  await seedKos();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
