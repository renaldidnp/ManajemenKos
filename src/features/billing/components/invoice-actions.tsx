"use client";

import { BadgeCheck, Pencil, Trash2, Undo2 } from "lucide-react";
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
import type { InvoiceStatus } from "@/features/billing/status";
import {
  deleteInvoice,
  toggleInvoicePaid,
} from "@/features/billing/server/actions";

type InvoiceActionsProps = {
  invoiceId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
};

export function InvoiceActions({
  invoiceId,
  invoiceNumber,
  status,
}: InvoiceActionsProps) {
  const router = useRouter();
  const [toggleOpen, setToggleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isPaid = status === "PAID";

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await toggleInvoicePaid(invoiceId);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        result.data.status === "PAID"
          ? "Tagihan ditandai sudah dibayar."
          : "Tagihan ditandai belum dibayar.",
      );
      setToggleOpen(false);
      router.refresh();
    });
  }

  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await deleteInvoice(invoiceId);

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
      {status !== "CANCELLED" ? (
        <AlertDialog open={toggleOpen} onOpenChange={setToggleOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              aria-label={
                isPaid
                  ? "Tandai tagihan belum dibayar"
                  : "Tandai tagihan sudah dibayar"
              }
              title={
                isPaid
                  ? "Tandai tagihan belum dibayar"
                  : "Tandai tagihan sudah dibayar"
              }
            >
              {isPaid ? (
                <Undo2 className="size-4 text-muted-foreground" />
              ) : (
                <BadgeCheck className="size-4 text-emerald-600" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isPaid
                  ? `Tandai tagihan ${invoiceNumber} belum dibayar?`
                  : `Tandai tagihan ${invoiceNumber} sudah dibayar?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isPaid
                  ? "Status pembayaran akan dikembalikan ke belum dibayar dan tanggal pembayaran dihapus."
                  : "Tagihan akan ditandai lunas dan tanggal pembayaran diisi otomatis."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggle} disabled={isPending}>
                {isPending
                  ? "Memproses..."
                  : isPaid
                    ? "Tandai belum dibayar"
                    : "Tandai sudah dibayar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      <Button asChild variant="ghost" size="icon">
        <Link
          href={`/admin/bills/${invoiceId}/edit`}
          aria-label="Ubah tagihan"
          title="Ubah tagihan"
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
            aria-label="Hapus tagihan"
            title="Hapus tagihan"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tagihan {invoiceNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Riwayat pembayaran yang
              terhubung dengan tagihan ini juga akan dihapus.
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
