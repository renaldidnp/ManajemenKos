# Kos

Aplikasi kos **single-tenant**: landing page, manajemen kos, sistem booking, dan chatbot berbasis web widget.

> Status: **Sprint 1 selesai** — scaffold, autentikasi (login/register), proteksi route berbasis role, dan seed admin sudah berjalan.

## Stack

| Lapisan | Pilihan |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL (Docker, image `pgvector/pgvector:pg16`) + Prisma 7 |
| Driver DB | `@prisma/adapter-pg` (Prisma 7 query compiler) |
| Auth | Better Auth — role `admin` dan `tenant` |
| Validasi | Zod + React Hook Form |
| Chatbot | Web widget + abstraksi `ChatProvider` (Ollama lokal → OpenAI/Gemini nanti) |
| RAG | `pgvector` untuk knowledge base / FAQ kos |
| Storage | Lokal (`public/uploads`) dulu → Cloudinary nanti |
| Pembayaran | Interface `PaymentProvider` (stub) → Midtrans nanti |
| Dev | Docker Compose + Ollama (full offline) |

## Struktur Folder

```text
.
├─ prisma/
│  ├─ schema/                # schema Prisma multi-file (folder)
│  │  ├─ schema.prisma       # generator + datasource
│  │  ├─ auth.prisma         # User, Session, Account, Verification
│  │  ├─ kos.prisma          # Kos, KosImage, Room, RoomImage
│  │  ├─ tenant.prisma       # Tenant
│  │  ├─ booking.prisma      # Booking
│  │  ├─ billing.prisma      # Invoice, Payment
│  │  └─ chat.prisma         # Chat, KnowledgeDoc (pgvector)
│  ├─ migrations/
│  └─ seed.ts
│
├─ src/
│  ├─ app/                   # ROUTING + komposisi UI saja (thin)
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ (marketing)/        # halaman publik
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx         # landing
│  │  │  ├─ kos/
│  │  │  │  ├─ page.tsx      # listing kos (ISR)
│  │  │  │  └─ [slug]/page.tsx
│  │  │  └─ faq/page.tsx
│  │  ├─ (auth)/
│  │  │  ├─ login/page.tsx
│  │  │  └─ register/page.tsx
│  │  ├─ (dashboard)/
│  │  │  ├─ layout.tsx       # sidebar + guard role
│  │  │  ├─ admin/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ kos/
│  │  │  │  ├─ rooms/
│  │  │  │  ├─ tenants/
│  │  │  │  ├─ bookings/
│  │  │  │  └─ bills/
│  │  │  └─ tenant/          # portal penghuni
│  │  └─ api/
│  │     ├─ auth/[...all]/route.ts   # Better Auth handler
│  │     ├─ chat/route.ts            # streaming chatbot
│  │     └─ webhooks/payment/route.ts
│  │
│  ├─ features/              # LOGIKA BISNIS (vertical slice per domain)
│  │  ├─ auth/               # skema + form login/register + user menu
│  │  ├─ kos/
│  │  ├─ rooms/
│  │  ├─ bookings/
│  │  ├─ tenants/
│  │  ├─ billing/
│  │  └─ chat/
│  │     ├─ components/
│  │     └─ server/
│  │        # tiap feature: components/, server/{queries,actions}.ts,
│  │        # schemas.ts, types.ts
│  │
│  ├─ components/            # komponen generik / reusable
│  │  ├─ ui/                 # shadcn
│  │  ├─ layout/             # navbar, sidebar, footer
│  │  └─ shared/             # DataTable, PageHeader, EmptyState
│  │
│  ├─ lib/                   # infrastruktur & cross-cutting
│  │  ├─ db.ts               # Prisma singleton + adapter pg
│  │  ├─ auth.ts             # konfigurasi Better Auth (server)
│  │  ├─ auth-client.ts      # Better Auth client (browser)
│  │  ├─ session.ts          # getSession + guard requireAdmin/requireTenant
│  │  ├─ action-result.ts    # tipe ActionResult seragam
│  │  ├─ env.ts              # validasi environment (Zod)
│  │  ├─ utils.ts
│  │  ├─ storage.ts
│  │  ├─ rate-limit.ts
│  │  └─ providers/          # chat (Ollama/OpenAI), payment (stub/Midtrans)
│  │
│  ├─ proxy.ts               # proteksi route /admin & /tenant (optimistic)
│  ├─ generated/            # Prisma Client (gitignored, hasil `db:generate`)
│  ├─ config/                # site.ts, nav.ts
│  ├─ hooks/
│  └─ styles/
│
├─ tests/
│  ├─ unit/                  # Vitest
│  └─ e2e/                   # Playwright
│
├─ docker-compose.yml
├─ prisma.config.ts
├─ next.config.ts
├─ eslint.config.mjs
├─ components.json
├─ .env.example
└─ README.md
```

## Prinsip Arsitektur

- **`app/` tipis.** File di `app/` hanya merangkai `features/` dan `components/`; tidak menulis query Prisma langsung.
- **Arah dependensi satu arah:** `app → features → lib`. Antar-`features` tidak saling import; komposisi dilakukan di `app/` atau lewat `lib`.
- **Backend colocated.** Tidak ada server terpisah:
  - Baca data → `features/*/server/queries.ts`
  - Mutasi → `features/*/server/actions.ts` (Server Actions)
  - Endpoint HTTP publik → `app/api/*/route.ts` (chat streaming, webhook)
- **`server-only`.** Semua modul `server/` diberi `import "server-only"` agar tidak bocor ke client bundle.
- **Zod di batas.** Setiap action/route memvalidasi input dengan `schemas.ts` dan mengembalikan `ActionResult<T>` yang konsisten.
- **Env tervalidasi.** `lib/env.ts` gagal cepat saat build bila env tidak lengkap.
- **Prisma multi-file.** Model dipecah per domain agar tidak menumpuk di satu file.

## Alur Contoh — Submit Booking

```text
app/(marketing)/kos/[slug]/booking-form.tsx        (client)
        │
        ▼
features/bookings/server/actions.ts                ("use server")
  ├─ validasi input        → features/bookings/schemas.ts (Zod)
  ├─ cek ketersediaan     → features/bookings/server/availability.ts
  ├─ tulis ke database    → lib/db.ts (Prisma)
  └─ revalidatePath("/admin/bookings")
```

## Model Data (ringkas)

- `User` — akun dengan role `admin` | `tenant`
- `Kos` — data properti kos
- `Room` — kamar + `RoomImage`
- `Tenant` — data penghuni
- `Booking` — pengajuan sewa (pending/confirmed/cancelled)
- `Invoice`, `Payment` — tagihan & pembayaran
- `ChatConversation`, `ChatMessage` — riwayat chatbot
- `KnowledgeDoc` — knowledge base untuk RAG (embedding `vector`)

## Autentikasi & Role

- **Registrasi** (`/register`) selalu membuat akun dengan role `tenant`.
- **Admin** dibuat lewat seed menggunakan `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, dan `SEED_ADMIN_PASSWORD`. Jika env kosong, seed admin dilewati.
- **Guard**:
  - `src/proxy.ts` melakukan redirect optimistic untuk `/admin` dan `/tenant` bila cookie sesi tidak ada.
  - Validasi sebenarnya di server: `requireAdmin()` / `requireTenant()` (`src/lib/session.ts`).
- **Redirect setelah login**: mengikuti parameter `?next=` bila aman, selain itu `/admin` untuk admin dan `/tenant` untuk penghuni.
- Logout tersedia lewat menu pengguna di navbar/dashboard.

## Pengembangan Lokal (offline)

```bash
# 1. Jalankan PostgreSQL + pgvector
docker compose up -d

# 2. Siapkan environment (sudah dibuat; sesuaikan bila perlu)
cp .env.example .env

# 3. Install dependensi, generate client, migrasi, dan seed
npm install
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Jalankan dev server
npm run dev
```

Isi `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` di `.env` sebelum `npm run db:seed` untuk membuat akun admin.

Perintah lain: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run db:studio`.

Chatbot lokal memakai **Ollama** (`docker compose --profile ai up -d ollama`) agar tidak butuh koneksi internet. Ganti provider ke OpenAI/Gemini cukup lewat `lib/providers/chat`.

## Roadmap

1. **Setup** ✅ — Next.js, Tailwind, Better Auth, Docker Postgres+pgvector, Prisma, seed.
2. **Landing page** — hero, listing kos/kamar, galeri, FAQ, CTA booking (placeholder sudah ada).
3. **Auth & role** ✅ — login/register, seed admin, proteksi route berbasis role, logout.
4. **Manajemen** — CRUD kos/kamar, penghuni, tagihan & status sewa.
5. **Booking** — ketersediaan kamar, form, status booking.
6. **Chatbot** — widget + RAG dari FAQ/data kamar.
7. **Pembayaran & deploy** — Midtrans, lalu hosting.

## Konvensi

- Path alias: `@/*` → `src/*`.
- Nama file: `kebab-case`; komponen React: `PascalCase`.
- Test diletakkan di `tests/`, bukan di dalam `src/`.
- Jangan commit secret; gunakan `.env` (lihat `.env.example`).
