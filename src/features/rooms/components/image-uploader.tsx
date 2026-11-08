"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch("/api/uploads", {
          method: "POST",
          body,
        });
        const json = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (!response.ok || !json.url) {
          toast.error(json.error ?? "Gagal mengunggah gambar.");
          continue;
        }

        uploaded.push(json.url);
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, current) => current !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-24 w-32 overflow-hidden rounded-md border"
          >
            <Image
              src={url}
              alt={`Foto kamar ${index + 1}`}
              width={160}
              height={120}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-1 right-1 rounded-full bg-background/90 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Hapus gambar"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-24 w-32 flex-col gap-2 border-dashed"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          <span className="text-xs">
            {isUploading ? "Mengunggah..." : "Tambah foto"}
          </span>
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG, atau WEBP. Maksimal 5 MB per gambar.
      </p>
    </div>
  );
}
