import { BedDouble, Maximize2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ROOM_STATUSES,
  roomStatusLabels,
} from "@/features/rooms/schemas";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type RoomCardProps = {
  room: {
    id: string;
    number: string;
    name: string | null;
    priceMonthly: number;
    size: string | null;
    capacity: number;
    status: (typeof ROOM_STATUSES)[number];
    facilities: string[];
    images: { url: string; alt: string | null }[];
  };
  href?: string;
  showStatus?: boolean;
};

const statusVariant: Record<
  (typeof ROOM_STATUSES)[number],
  "default" | "secondary" | "destructive"
> = {
  AVAILABLE: "default",
  OCCUPIED: "secondary",
  MAINTENANCE: "destructive",
};

export function RoomCard({ room, href, showStatus }: RoomCardProps) {
  const cover = room.images[0];
  const title = room.name ? `${room.number} · ${room.name}` : room.number;

  const content = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border transition-colors hover:bg-muted/30">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? `Foto kamar ${room.number}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BedDouble className="size-10 text-muted-foreground" />
          </div>
        )}
        {showStatus ? (
          <Badge
            variant={statusVariant[room.status]}
            className="absolute top-3 left-3"
          >
            {roomStatusLabels[room.status]}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(room.priceMonthly)}
            <span className="text-xs"> / bulan</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {room.capacity} orang
          </span>
          {room.size ? (
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-3.5" />
              {room.size}
            </span>
          ) : null}
        </div>

        {room.facilities.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {room.facilities.slice(0, 4).map((facility) => (
              <Badge key={facility} variant="outline">
                {facility}
              </Badge>
            ))}
            {room.facilities.length > 4 ? (
              <Badge variant="outline">
                +{room.facilities.length - 4}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className={cn("block h-full")}>
      {content}
    </Link>
  );
}
