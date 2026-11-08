import { BedDouble, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteRoomButton } from "@/features/rooms/components/delete-room-button";
import {
  ROOM_STATUSES,
  roomStatusLabels,
} from "@/features/rooms/schemas";
import { formatCurrency } from "@/lib/format";

type RoomRow = {
  id: string;
  number: string;
  name: string | null;
  priceMonthly: number;
  capacity: number;
  status: (typeof ROOM_STATUSES)[number];
  size: string | null;
  images: { url: string }[];
};

const statusVariant: Record<
  (typeof ROOM_STATUSES)[number],
  "default" | "secondary" | "destructive"
> = {
  AVAILABLE: "default",
  OCCUPIED: "secondary",
  MAINTENANCE: "destructive",
};

export function RoomsTable({ rooms }: { rooms: RoomRow[] }) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <BedDouble className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Belum ada kamar</p>
          <p className="text-sm text-muted-foreground">
            Tambahkan kamar pertama untuk mulai menerima booking.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">Tambah kamar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kamar</TableHead>
            <TableHead>Harga / bulan</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {room.images[0] ? (
                      <Image
                        src={room.images[0].url}
                        alt={`Foto kamar ${room.number}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BedDouble className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{room.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {[room.name, room.size].filter(Boolean).join(" · ") ||
                        "—"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(room.priceMonthly)}</TableCell>
              <TableCell>{room.capacity} orang</TableCell>
              <TableCell>
                <Badge variant={statusVariant[room.status]}>
                  {roomStatusLabels[room.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      aria-label="Ubah kamar"
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteRoomButton
                    roomId={room.id}
                    roomNumber={room.number}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
