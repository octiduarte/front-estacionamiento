import { useState } from "react";

export const useManageReservation = () => {
  const [step, setStep] = useState(1);
  const [reservation, setReservation] = useState<any>(null);
  const [cancelled, setCancelled] = useState(false);

  const handleReservationFound = (foundReservation: any) => {
    setReservation(foundReservation);
    setStep(2);
  };

  const handleBack = () => {
    setReservation(null);
    setCancelled(false);
    setStep(1);
  };

  const handleCancel = () => {
    setCancelled(true);
    setStep(3);
  };

  const resetState = () => {
    setStep(1);
    setReservation(null);
    setCancelled(false);
  };

  return {
    step,
    reservation,
    cancelled,
    handleReservationFound,
    handleBack,
    handleCancel,
    resetState,
  };
};
