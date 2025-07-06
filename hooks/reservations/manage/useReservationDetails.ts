import { useState } from "react";

export const useReservationDetails = (initialReservation: any) => {
  const [reservation, setReservation] = useState(initialReservation);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const showCancelConfirm = () => {
    setCancelConfirm(true);
  };

  const hideCancelConfirm = () => {
    setCancelConfirm(false);
  };

  const confirmCancel = (onCancel: () => void) => {
    setCancelConfirm(false);
    onCancel();
  };

  const handlePrint = () => {
    window.print();
  };

  const resetState = () => {
    setCancelConfirm(false);
    setSuccess(false);
    setError(false);
  };

  return {
    reservation,
    cancelConfirm,
    success,
    error,
    showCancelConfirm,
    hideCancelConfirm,
    confirmCancel,
    handlePrint,
    resetState,
  };
};
