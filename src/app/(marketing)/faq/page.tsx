import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Pertanyaan yang sering diajukan
      </h1>
      <p className="mt-2 text-muted-foreground">
        Konten FAQ akan diisi dan juga dipakai sebagai knowledge base chatbot.
      </p>
    </div>
  );
}
