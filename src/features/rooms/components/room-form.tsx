"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/features/rooms/components/image-uploader";
import {
  ROOM_STATUSES,
  roomSchema,
  roomStatusLabels,
  type RoomInput,
} from "@/features/rooms/schemas";
import {
  createRoom,
  updateRoom,
} from "@/features/rooms/server/actions";

type RoomFormProps = {
  mode: "create" | "edit";
  room?: {
    id: string;
    number: string;
    name: string | null;
    description: string | null;
    priceMonthly: number;
    size: string | null;
    capacity: number;
    status: (typeof ROOM_STATUSES)[number];
    facilities: string[];
    images: { url: string }[];
  };
};

export function RoomForm({ mode, room }: RoomFormProps) {
  const router = useRouter();
  const [facilitiesText, setFacilitiesText] = useState(
    room?.facilities.join(", ") ?? "",
  );

  const form = useForm<RoomInput>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: room?.number ?? "",
      name: room?.name ?? "",
      description: room?.description ?? "",
      priceMonthly: room?.priceMonthly ?? 0,
      size: room?.size ?? "",
      capacity: room?.capacity ?? 1,
      status: room?.status ?? "AVAILABLE",
      facilities: room?.facilities ?? [],
      images: room?.images.map((image) => image.url) ?? [],
    },
  });

  async function onSubmit(values: RoomInput) {
    const payload: RoomInput = {
      ...values,
      facilities: facilitiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: values.images ?? [],
    };

    const result =
      mode === "edit" && room
        ? await updateRoom(room.id, payload)
        : await createRoom(payload);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          form.setError(key as keyof RoomInput, { message: messages[0] });
        }
      }
      toast.error(result.error);
      return;
    }

    router.push("/admin/rooms");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "edit" ? "Ubah kamar" : "Tambah kamar"}
            </CardTitle>
            <CardDescription>
              Lengkapi detail kamar, fasilitas, dan foto.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor kamar</FormLabel>
                  <FormControl>
                    <Input placeholder="A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama kamar (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Kamar AC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceMonthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga per bulan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={50000}
                      value={field.value || ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? 0
                            : Number(event.target.value),
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapasitas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={field.value || ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? 1
                            : Number(event.target.value),
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ukuran (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="3x3 m" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROOM_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {roomStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="sm:col-span-2">
              <FormLabel>Fasilitas</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kasur, Lemari, WiFi"
                  value={facilitiesText}
                  onChange={(event) => setFacilitiesText(event.target.value)}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Pisahkan dengan koma.
              </p>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Foto kamar</FormLabel>
                  <ImageUploader
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/rooms")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan perubahan"
                : "Tambah kamar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
