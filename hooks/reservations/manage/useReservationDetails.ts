import { useState } from "react";
import { cancelReservation } from "@/lib/reservations/manage/cancelReservation";

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
      // Call the parent callback after successful cancellation
      setTimeout(() => {
        onCancel();
      }, 2000); // Give time to show success message
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
