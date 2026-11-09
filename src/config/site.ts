export const siteConfig = {
  name: "KosKita",
  description:
    "KosKita adalah hunian kos nyaman dengan satu pengelola. Lihat kamar, fasilitas, dan ajukan sewa langsung tanpa perantara.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export type SiteConfig = typeof siteConfig;
