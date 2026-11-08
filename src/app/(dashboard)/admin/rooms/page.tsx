import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoomsTable } from "@/features/rooms/components/rooms-table";
import { getRooms } from "@/features/rooms/server/queries";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kamar</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola kamar, harga, fasilitas, dan ketersediaan.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <Plus />
            Tambah kamar
          </Link>
        </Button>
      </div>

      <RoomsTable rooms={rooms} />
    </div>
  );
}
