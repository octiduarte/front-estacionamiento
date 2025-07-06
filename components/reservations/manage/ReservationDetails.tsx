"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Printer, X } from "lucide-react";
import { useReservationDetails } from "@/hooks/reservations/manage/useReservationDetails";

interface ReservationDetailsProps {
  reservation: any;
  onBack: () => void;
  onCancel: () => void;
}

export default function ReservationDetails({ reservation, onBack, onCancel }: ReservationDetailsProps) {
  const t = useTranslations("ManageReservation");
  const tRes = useTranslations("Reservation");
  const {
    cancelConfirm,
    success,
    error,
    showCancelConfirm,
    hideCancelConfirm,
    confirmCancel,
    handlePrint,
  } = useReservationDetails(reservation);

  const handleCancelReservation = () => {
    showCancelConfirm();
  };

  const handleConfirmCancel = () => {
    confirmCancel(onCancel);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {cancelConfirm && (
        <div className="bg-muted p-4 rounded-md text-center">
          <div className="mb-2">{t("cancelConfirm")}</div>
          <div className="flex gap-2 justify-center">
            <Button variant="destructive" onClick={handleConfirmCancel}>
              {t("cancel")}
            </Button>
            <Button
              variant="outline"
              onClick={hideCancelConfirm}
            >
              {t("back")}
            </Button>
          </div>
        </div>
      )}
      
      {!cancelConfirm && (
        <>
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancelReservation}
            >
              <X className="w-4 h-4 mr-2" /> {t("cancel")}
            </Button>
            <Button className="flex-1" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> {t("print")}
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={onBack}>
              {t("back")}
            </Button>
          </div>
          {success && (
            <div className="text-green-600 text-sm mt-2">
              {t("success")}
            </div>
          )}
          {error && (
            <div className="text-destructive text-sm mt-2">
              {t("error")}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
