"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Printer, X } from "lucide-react";
import { useReservationDetails } from "@/hooks/reservations/manage/useReservationDetails";
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

interface ReservationDetailsProps {
  reservation: any;
  onBack: () => void;
  onCancel: () => void;
}

export default function ReservationDetails({ reservation, onBack, onCancel }: ReservationDetailsProps) {
  const t = useTranslations("ManageReservation");
  const tRes = useTranslations("Reservation");
  const {
    success,
    error,
    isLoading,
    confirmCancel,
    handlePrint,
  } = useReservationDetails(reservation);

  const handleConfirmCancel = async () => {
    await confirmCancel(onCancel);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-muted p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">
            {tRes("reservationCode")}:
          </span>
          <span className="font-mono">
            {reservation.code}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{tRes("name")}:</span>
            <span>
              {reservation.firstName} {reservation.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{tRes("vehicleType")}:</span>
            <span className="capitalize">
              {tRes(reservation.vehicleType)}
            </span>
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
            <span>
              {reservation.paymentMethod === "creditCard"
                ? tRes("payOnline")
                : tRes("payOnSite")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" /> {t("cancel")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmCancelReservation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmCancelDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>{t("back")}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmCancel}
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "..." : t("cancel")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button className="flex-1" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> {t("print")}
        </Button>
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={onBack}>
          {t("back")}
        </Button>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
    </motion.div>
  );
}
