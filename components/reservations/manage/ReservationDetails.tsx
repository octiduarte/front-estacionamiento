"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Printer, X, ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { cancelReservation } from "@/lib/reservations/manage/cancelReservation";
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
import { MappedReservation } from "@/types/reservation";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'


interface ReservationDetailsProps {
  reservation: MappedReservation;
  onBack: () => void;
  onCancel: () => void;
}

export default function ReservationDetails({
  reservation,
  onBack,
  onCancel,
}: ReservationDetailsProps) {
  const t = useTranslations("ManageReservation");
  const tRes = useTranslations("Reservation");

  const handlePrint = () => {
    window.print();
  };

  const { isPending: isFetching, mutate: cancelMutate } = useMutation({
    mutationFn: () => cancelReservation(reservation.code),
    onSuccess: () => {
      onCancel();
    },
    onError: (error) => {
      if (
        // Si el error es el código específico de 12 horas, usar la traducción
        error.message === "CANNOT_CANCEL_LESS_THAN_12_HOURS" ||
        error?.toString().includes("CANNOT_FOUND")
      ) {
        toast.error(t("cancelError"));
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleConfirmCancel = async () => {
    cancelMutate();
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <Spinner size="md" />
        <p className="mt-4 text-muted-foreground">{t("cancelling")}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 1 }}
      className="space-y-6 "
    >
      <div className="bg-muted p-4  rounded-md border border-input">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-primary">
            {tRes("reservationCode")}:
          </span>
          <span className="font-mono text-primary">{reservation.code}</span>
        </div>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span>{tRes("name")}:</span>
            <span className="capitalize">
              {reservation.firstName} {reservation.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("vehicleType")}:</span>
            <span className="capitalize">{tRes(reservation.vehicleType)}</span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("entryDateTime")}:</span>
            <span>
              {reservation.entryDate} {reservation.entryTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("exitDateTime")}:</span>
            <span>
              {reservation.exitDate} {reservation.exitTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("licensePlate")}:</span>
            <span>{reservation.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("vehicleModel")}:</span>
            <span>{reservation.vehicleModel}</span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("paymentMethod")}:</span>
            <span>{t(reservation.paymentMethod)}</span>
          </div>
        </div>
      </div>

      {/* Botones Atrás y Cancelar en la misma fila */}
      <div className="flex flex-row gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <X className="w-4 h-4 mr-2" /> {t("cancel")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("confirmCancelReservation")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmCancelDescription")}
              </AlertDialogDescription>
               {reservation.paymentMethod === "online" && (
                <AlertDialogDescription>
                  {t("refundMessage")}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isFetching}>
                {t("back")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isFetching}
              >
                {t("cancel")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Botón Imprimir abajo, ancho completo */}
      <Button className="w-full mt-4" onClick={handlePrint}>
        <Printer className="w-4 h-4 mr-2" /> {t("print")}
      </Button>
    </motion.div>
  );
}
