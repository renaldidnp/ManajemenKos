import { notFound } from "next/navigation";
import { RoomForm } from "@/features/rooms/components/room-form";
import { getRoom } from "@/features/rooms/server/queries";

type EditRoomPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const room = await getRoom(id);

  if (!room) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ubah kamar {room.number}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Perbarui detail, fasilitas, dan foto kamar.
        </p>
      </div>

      <RoomForm mode="edit" room={room} />
    </div>
  );
}
