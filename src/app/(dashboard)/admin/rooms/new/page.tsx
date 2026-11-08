import { RoomForm } from "@/features/rooms/components/room-form";

export default function NewRoomPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tambah kamar</h1>
        <p className="mt-2 text-muted-foreground">
          Isi detail kamar yang akan disewakan.
        </p>
      </div>

      <RoomForm mode="create" />
    </div>
  );
}
