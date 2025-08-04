import { useReservationFormState } from "./useReservationFormState";
import { useReservationPrice } from "./useReservationPrice";
import { useReservationSubmission } from "./useReservationSubmission";
import { useReservationSteps } from "./useReservationSteps";
import { CountryOption } from "@/types/reservation";
import { useEffect } from "react";
// Tipos explícitos para los datos del formulario y props del hook

export function useReservationForm(
  t: (key: string) => string,
  countryOptions: CountryOption[],
  locale: string
) {
  // Subhooks para dividir responsabilidades
  const steps = useReservationSteps();
  const formState = useReservationFormState(countryOptions);
  const price = useReservationPrice();
  const submission = useReservationSubmission(t);

  // Volver al step 1 cuando availability se resetee por el timer
  useEffect(() => {
    if (formState.availability === null && steps.currentStep > 1 && formState.timer === 0) {
      steps.setCurrentStep(1);
    }
  }, [formState.availability, formState.timer, steps]);

  // Handlers que conectan los subhooks
  const handleSelectChange = (name: string, value: string) => {
    formState.handleSelectChange(name, value);
  };

  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => {
    formState.handleDateChange(name, date);
  };

  const fetchTotalPrice = async () => {
    await price.fetchTotalPrice(
      formState.formData.vehicleType,
      formState.start_time,
      formState.end_time
    );
  };

  // Funciones del flujo principal
  const nextStep = async () => {
    if (steps.currentStep === 2) {
      await fetchTotalPrice();
    }
    if (steps.currentStep === 3) {
      submission.generateReservationCode();
    }
    steps.nextStep();
  };

  const prevStep = () => {
    steps.prevStep();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReservation = async () => {
    await submission.submitReservation(
      { ...formState.formData, language: locale },
      formState.selectedCountry,
      formState.start_time,
      formState.end_time,
      price.totalPrice
    );
  };

  return {
    // Estados del flujo de pasos
    currentStep: steps.currentStep,
    
    // Estados de envío de reserva
    reservationCode: submission.reservationCode,
    submissionError: submission.submissionError,
    submitting: submission.submitting,
    
    // Estados del formulario
    formData: formState.formData,
    entryDateObj: formState.entryDateObj,
    exitDateObj: formState.exitDateObj,
    selectedCountry: formState.selectedCountry,
    setSelectedCountry: formState.setSelectedCountry,
    start_time: formState.start_time,
    end_time: formState.end_time,
    
    // Estados de disponibilidad (replicados del admin)
    availability: formState.availability,
    setAvailability: formState.setAvailability,
    slotDetails: formState.slotDetails,
    setSlotDetails: formState.setSlotDetails,
    timer: formState.timer,
    setTimer: formState.setTimer,
    
    // Estados de precio
    totalPrice: price.totalPrice,
    
    // Handlers
    handleChange: formState.handleChange,
    handleSelectChange,
    handleDateChange,
    fetchTotalPrice,
    
    // Funciones del flujo principal
    nextStep,
    prevStep,
    handlePrint,
    handleReservation,
  };
}
