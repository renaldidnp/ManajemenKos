"use client";

import {
  Check,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { BookingStatus } from "@/features/bookings/status";
import {
  deleteBooking,
  updateBookingStatus,
} from "@/features/bookings/server/actions";

type BookingActionsProps = {
  bookingId: string;
  bookingCode: string;
  bookingName: string;
  status: BookingStatus;
};

export function BookingActions({
  bookingId,
  bookingCode,
  bookingName,
  status,
}: BookingActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function runStatus(
    nextStatus: BookingStatus,
    close: (open: boolean) => void,
  ) {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, nextStatus);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        nextStatus === "CONFIRMED"
          ? "Booking dikonfirmasi."
          : nextStatus === "CANCELLED"
            ? "Booking dibatalkan."
            : "Booking dibuka kembali.",
      );
      close(false);
      router.refresh();
    });
  }

  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await deleteBooking(bookingId);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setDeleteOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {status === "PENDING" ? (
        <>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                aria-label="Konfirmasi booking"
                title="Konfirmasi booking"
              >
                <Check className="size-4 text-emerald-600" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Konfirmasi booking {bookingCode}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Booking atas nama {bookingName} akan dikonfirmasi dan kamar
                  ditandai terisi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    runStatus("CONFIRMED", setConfirmOpen);
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Memproses..." : "Konfirmasi"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                aria-label="Batalkan booking"
                title="Batalkan booking"
              >
                <X className="size-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Batalkan booking {bookingCode}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Booking atas nama {bookingName} akan dibatalkan. Kamar akan
                  tersedia kembali jika tidak ada penghuni atau booking aktif
                  lain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Kembali</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    runStatus("CANCELLED", setCancelOpen);
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Memproses..." : "Batalkan booking"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : null}

      {status === "CONFIRMED" ? (
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              aria-label="Batalkan booking"
              title="Batalkan booking"
            >
              <X className="size-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Batalkan booking {bookingCode}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Booking atas nama {bookingName} akan dibatalkan. Kamar akan
                tersedia kembali jika tidak ada penghuni atau booking aktif lain.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kembali</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  runStatus("CANCELLED", setCancelOpen);
                }}
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Batalkan booking"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      {status === "CANCELLED" || status === "EXPIRED" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => runStatus("PENDING", () => {})}
          disabled={isPending}
          aria-label="Buka kembali booking"
          title="Buka kembali booking"
        >
          <RotateCcw className="size-4 text-emerald-600" />
        </Button>
      ) : null}

      <Button asChild variant="ghost" size="icon">
        <Link
          href={`/admin/bookings/${bookingId}/edit`}
          aria-label="Ubah booking"
          title="Ubah booking"
        >
          <Pencil className="size-4" />
        </Link>
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label="Hapus booking"
            title="Hapus booking"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus booking {bookingCode}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Tagihan yang terhubung akan
              tetap tersimpan tanpa terhubung ke booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
