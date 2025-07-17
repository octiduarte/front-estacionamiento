import { useState } from "react";
import { cancelReservation } from "@/lib/reservations/manage/cancelReservation";
import { useTranslations } from "next-intl";

export const useReservationDetails = (initialReservation: any) => {
  const [reservation, setReservation] = useState(initialReservation);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("ManageReservation");

  const confirmCancel = async (onCancel: () => void) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await cancelReservation(reservation.code);
      setSuccess(true);
      onCancel();
    } catch (err) {
      if (err instanceof Error) {
        // Si el error es el código específico de 12 horas, usar la traducción
        if (err.message === 'CANNOT_CANCEL_LESS_THAN_12_HOURS') {
          setError(t("cancelError"));
        } else {
          setError(err.message);
        }
      } else {
        setError("Could not cancel reservation");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    reservation,
    success,
    error,
    isLoading,
    confirmCancel,
    handlePrint,
  };
};
