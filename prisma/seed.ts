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
  appName: "KosKita",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

function date(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

async function seedKos() {
  const kos = await prisma.kos.upsert({
    where: { slug: "koskita" },
    update: {
      name: "KosKita",
      description:
        "KosKita adalah hunian kos nyaman dengan satu pengelola, dekat dengan kampus serta pusat perbelanjaan.",
      address: "Jl. Melati No. 10",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40123",
      phone: "081234567890",
      whatsapp: "081234567890",
      priceFrom: 750000,
      published: true,
    },
    create: {
      name: "KosKita",
      slug: "koskita",
      description:
        "KosKita adalah hunian kos nyaman dengan satu pengelola, dekat dengan kampus serta pusat perbelanjaan.",
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
      name: "Single Nyaman",
      priceMonthly: 750000,
      size: "3x3 m",
      capacity: 1,
      status: "OCCUPIED" as const,
      description:
        "Kamar single dengan kasur nyaman, lemari, kipas angin, dan WiFi. Cocok untuk mahasiswa yang butuh ruang tenang.",
      facilities: ["Kasur", "Lemari", "Kipas angin", "WiFi"],
    },
    {
      number: "A2",
      name: "Single Luas",
      priceMonthly: 850000,
      size: "3x3.5 m",
      capacity: 1,
      status: "OCCUPIED" as const,
      description:
        "Kamar single yang sedikit lebih luas dengan sirkulasi udara baik, dilengkapi kasur, lemari, kipas angin, dan WiFi.",
      facilities: ["Kasur", "Lemari", "Kipas angin", "WiFi", "Meja belajar"],
    },
    {
      number: "B1",
      name: "Sharing Hemat",
      priceMonthly: 1200000,
      size: "4x4 m",
      capacity: 2,
      status: "OCCUPIED" as const,
      description:
        "Kamar sharing untuk 2 orang dengan ruang lebih lega, cocok untuk teman atau pasangan.",
      facilities: ["Kasur", "Lemari", "AC", "WiFi", "Kamar mandi dalam"],
    },
    {
      number: "B2",
      name: "Sharing AC",
      priceMonthly: 1100000,
      size: "4x4 m",
      capacity: 2,
      status: "AVAILABLE" as const,
      description:
        "Kamar sharing dengan AC dan TV, cocok untuk dua orang yang ingin tinggal lebih nyaman.",
      facilities: ["Kasur", "Lemari", "AC", "WiFi", "TV"],
    },
    {
      number: "C1",
      name: "Premium",
      priceMonthly: 1500000,
      size: "4x5 m",
      capacity: 1,
      status: "AVAILABLE" as const,
      description:
        "Kamar premium dengan ruang lega, AC, kamar mandi dalam, dan akses dapur bersama.",
      facilities: [
        "Kasur",
        "Lemari",
        "AC",
        "WiFi",
        "Kamar mandi dalam",
        "Dapur bersama",
      ],
    },
  ];

  const roomByNumber = new Map<
    string,
    { id: string; number: string; priceMonthly: number }
  >();

  for (const room of rooms) {
    const { number, ...data } = room;
    const saved = await prisma.room.upsert({
      where: {
        kosId_number: { kosId: kos.id, number },
      },
      update: data,
      create: {
        ...room,
        kosId: kos.id,
      },
    });

    roomByNumber.set(saved.number, saved);
  }

  console.log(`Seeded kos "${kos.name}" with ${rooms.length} rooms.`);

  return { kos, roomByNumber };
}

async function seedDummyData(
  roomByNumber: Map<string, { id: string; number: string; priceMonthly: number }>,
) {
  const tenants = [
    {
      id: "seed-tenant-1",
      name: "Siti Rahmawati",
      phone: "081298765001",
      email: "siti.rahmawati@example.com",
      idCardNumber: "3273010101990001",
      emergencyContact: "081298765011",
      status: "ACTIVE" as const,
      roomNumber: "A1",
      startDate: date("2026-02-01"),
      endDate: date("2027-02-01"),
    },
    {
      id: "seed-tenant-2",
      name: "Budi Santoso",
      phone: "081298765002",
      email: "budi.santoso@example.com",
      idCardNumber: "3273010201990002",
      emergencyContact: "081298765012",
      status: "ACTIVE" as const,
      roomNumber: "A2",
      startDate: date("2026-03-01"),
      endDate: date("2027-03-01"),
    },
    {
      id: "seed-tenant-3",
      name: "Dewi Lestari",
      phone: "081298765003",
      email: "dewi.lestari@example.com",
      idCardNumber: "3273010301990003",
      emergencyContact: "081298765013",
      status: "ACTIVE" as const,
      roomNumber: "B1",
      startDate: date("2026-01-15"),
      endDate: date("2027-01-15"),
    },
    {
      id: "seed-tenant-4",
      name: "Rina Kartika",
      phone: "081298765004",
      email: "rina.kartika@example.com",
      idCardNumber: "3273010401990004",
      emergencyContact: "081298765014",
      status: "INACTIVE" as const,
      roomNumber: "B2",
      startDate: date("2025-06-01"),
      endDate: date("2026-06-01"),
    },
    {
      id: "seed-tenant-5",
      name: "Fajar Nugroho",
      phone: "081298765005",
      email: "fajar.nugroho@example.com",
      idCardNumber: "3273010501990005",
      emergencyContact: "081298765015",
      status: "INACTIVE" as const,
      roomNumber: "C1",
      startDate: date("2025-09-01"),
      endDate: date("2026-09-01"),
    },
  ];

  const tenantById = new Map<
    string,
    { id: string; name: string; phone: string; email: string | null }
  >();

  for (const tenant of tenants) {
    const { id, roomNumber, ...data } = tenant;
    const room = roomByNumber.get(roomNumber);

    if (!room) {
      continue;
    }

    const saved = await prisma.tenant.upsert({
      where: { id },
      update: { ...data, roomId: room.id },
      create: { id, ...data, roomId: room.id },
    });

    tenantById.set(saved.id, saved);
  }

  const bookings = [
    {
      code: "BK-2026-0001",
      roomNumber: "A1",
      name: "Siti Rahmawati",
      phone: "081298765001",
      email: "siti.rahmawati@example.com",
      moveInDate: date("2026-02-01"),
      durationMonths: 12,
      status: "CONFIRMED" as const,
      notes: "Sudah survei lokasi dan memilih kamar A1.",
    },
    {
      code: "BK-2026-0002",
      roomNumber: "A2",
      name: "Budi Santoso",
      phone: "081298765002",
      email: "budi.santoso@example.com",
      moveInDate: date("2026-03-01"),
      durationMonths: 12,
      status: "CONFIRMED" as const,
      notes: "Booking melalui website.",
    },
    {
      code: "BK-2026-0003",
      roomNumber: "B1",
      name: "Dewi Lestari",
      phone: "081298765003",
      email: "dewi.lestari@example.com",
      moveInDate: date("2026-01-15"),
      durationMonths: 12,
      status: "CONFIRMED" as const,
      notes: "Menempati kamar sharing bersama teman.",
    },
    {
      code: "BK-2026-0004",
      roomNumber: "B2",
      name: "Andi Pratama",
      phone: "081298765006",
      email: "andi.pratama@example.com",
      moveInDate: date("2026-12-01"),
      durationMonths: 6,
      status: "PENDING" as const,
      notes: "Menunggu konfirmasi ketersediaan kamar.",
    },
    {
      code: "BK-2026-0005",
      roomNumber: "C1",
      name: "Maya Sari",
      phone: "081298765007",
      email: "maya.sari@example.com",
      moveInDate: date("2026-09-01"),
      durationMonths: 3,
      status: "EXPIRED" as const,
      notes: "Booking kedaluwarsa karena tidak ada konfirmasi.",
    },
  ];

  const bookingByCode = new Map<string, { id: string; code: string }>();

  for (const booking of bookings) {
    const { roomNumber, ...data } = booking;
    const room = roomByNumber.get(roomNumber);

    if (!room) {
      continue;
    }

    const saved = await prisma.booking.upsert({
      where: { code: booking.code },
      update: { ...data, roomId: room.id },
      create: { ...data, roomId: room.id },
    });

    bookingByCode.set(saved.code, saved);
  }

  const invoices = [
    {
      number: "INV-2026-0001",
      tenantId: "seed-tenant-1",
      bookingCode: "BK-2026-0001",
      periodStart: date("2026-02-01"),
      periodEnd: date("2026-02-28"),
      amount: 750000,
      status: "PAID" as const,
      dueDate: date("2026-02-05"),
      paidAt: date("2026-02-03"),
    },
    {
      number: "INV-2026-0002",
      tenantId: "seed-tenant-2",
      bookingCode: "BK-2026-0002",
      periodStart: date("2026-03-01"),
      periodEnd: date("2026-03-31"),
      amount: 850000,
      status: "UNPAID" as const,
      dueDate: date("2026-03-10"),
      paidAt: null,
    },
    {
      number: "INV-2026-0003",
      tenantId: "seed-tenant-3",
      bookingCode: "BK-2026-0003",
      periodStart: date("2026-01-15"),
      periodEnd: date("2026-02-14"),
      amount: 1200000,
      status: "OVERDUE" as const,
      dueDate: date("2026-01-20"),
      paidAt: null,
    },
    {
      number: "INV-2026-0004",
      tenantId: "seed-tenant-1",
      bookingCode: null,
      periodStart: date("2026-03-01"),
      periodEnd: date("2026-03-31"),
      amount: 750000,
      status: "PAID" as const,
      dueDate: date("2026-03-05"),
      paidAt: date("2026-03-04"),
    },
    {
      number: "INV-2026-0005",
      tenantId: "seed-tenant-2",
      bookingCode: null,
      periodStart: date("2026-04-01"),
      periodEnd: date("2026-04-30"),
      amount: 850000,
      status: "CANCELLED" as const,
      dueDate: date("2026-04-10"),
      paidAt: null,
    },
  ];

  const invoiceByNumber = new Map<string, { id: string; number: string }>();

  for (const invoice of invoices) {
    const { number, tenantId, bookingCode, ...data } = invoice;
    const booking = bookingCode ? bookingByCode.get(bookingCode) : null;
    const tenant = tenantId ? tenantById.get(tenantId) : null;

    const saved = await prisma.invoice.upsert({
      where: { number },
      update: {
        ...data,
        tenantId: tenant?.id ?? null,
        bookingId: booking?.id ?? null,
      },
      create: {
        number,
        ...data,
        tenantId: tenant?.id ?? null,
        bookingId: booking?.id ?? null,
      },
    });

    invoiceByNumber.set(saved.number, saved);
  }

  const payments = [
    {
      id: "seed-payment-1",
      invoiceNumber: "INV-2026-0001",
      provider: "manual",
      providerRef: "TRX-0001",
      amount: 750000,
      status: "PAID" as const,
      paidAt: date("2026-02-03"),
    },
    {
      id: "seed-payment-2",
      invoiceNumber: "INV-2026-0002",
      provider: "manual",
      providerRef: "TRX-0002",
      amount: 850000,
      status: "PENDING" as const,
      paidAt: null,
    },
    {
      id: "seed-payment-3",
      invoiceNumber: "INV-2026-0003",
      provider: "manual",
      providerRef: "TRX-0003",
      amount: 1200000,
      status: "FAILED" as const,
      paidAt: null,
    },
    {
      id: "seed-payment-4",
      invoiceNumber: "INV-2026-0004",
      provider: "manual",
      providerRef: "TRX-0004",
      amount: 750000,
      status: "PAID" as const,
      paidAt: date("2026-03-04"),
    },
    {
      id: "seed-payment-5",
      invoiceNumber: "INV-2026-0005",
      provider: "manual",
      providerRef: "TRX-0005",
      amount: 850000,
      status: "REFUNDED" as const,
      paidAt: null,
    },
  ];

  for (const payment of payments) {
    const { id, invoiceNumber, ...data } = payment;
    const invoice = invoiceByNumber.get(invoiceNumber);

    if (!invoice) {
      continue;
    }

    await prisma.payment.upsert({
      where: { id },
      update: { ...data, invoiceId: invoice.id },
      create: { id, ...data, invoiceId: invoice.id },
    });
  }

  console.log(
    `Seeded ${tenants.length} tenants, ${bookings.length} bookings, ${invoices.length} invoices, and ${payments.length} payments.`,
  );
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
  const { roomByNumber } = await seedKos();
  await seedDummyData(roomByNumber);
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
