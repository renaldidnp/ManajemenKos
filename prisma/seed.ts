import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
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
    { number: "A1", priceMonthly: 750000, size: "3x3 m", capacity: 1 },
    { number: "A2", priceMonthly: 850000, size: "3x3.5 m", capacity: 1 },
    { number: "B1", priceMonthly: 1200000, size: "4x4 m", capacity: 2 },
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

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
