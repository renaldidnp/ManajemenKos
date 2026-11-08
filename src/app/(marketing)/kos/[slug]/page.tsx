import type { Metadata } from "next";

type KosDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: KosDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Kos ${slug}` };
}

export default async function KosDetailPage({ params }: KosDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Kos {slug}</h1>
      <p className="mt-2 text-muted-foreground">
        Detail kamar dan form booking akan tampil di sini.
      </p>
    </div>
  );
}
