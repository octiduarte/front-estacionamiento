import { useState } from "react";
import { cancelReservation } from "@/lib/reservations/manage/cancelReservation";
import { time } from "console";
import { TimerOff } from "lucide-react";

export const useReservationDetails = (initialReservation: any) => {
  const [reservation, setReservation] = useState(initialReservation);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmCancel = async (onCancel: () => void) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await cancelReservation(reservation.code);
      setSuccess(true);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel reservation");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetState = () => {
    setSuccess(false);
    setError(null);
  };

  return {
    reservation,
    success,
    error,
    isLoading,
    confirmCancel,
    handlePrint,
    resetState,
  };
};
