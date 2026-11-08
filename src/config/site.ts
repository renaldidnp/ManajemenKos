export const siteConfig = {
  name: "Kos",
  description:
    "Temukan kamar kos nyaman, ajukan sewa online, dan kelola kos dalam satu tempat.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export type SiteConfig = typeof siteConfig;
