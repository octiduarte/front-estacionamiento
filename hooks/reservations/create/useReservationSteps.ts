import { useState, useEffect } from "react";

export function useReservationSteps() {
  const getInitialStep = () => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("reservationStep");
      return saved ? Number(saved) : 2;
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);

  useEffect(() => {
    window.localStorage.setItem("reservationStep", String(currentStep));
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
  };
}
