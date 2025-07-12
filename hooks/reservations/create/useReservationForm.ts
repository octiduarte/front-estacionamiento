import { useReservationFormState } from "./useReservationFormState";
import { useReservationAvailability } from "./useReservationAvailability";
import { useReservationPrice } from "./useReservationPrice";
import { useReservationVehicleTypes } from "./useReservationVehicleTypes";
import { useReservationSubmission } from "./useReservationSubmission";
import { useReservationSteps } from "./useReservationSteps";

// Tipos explícitos para los datos del formulario y props del hook
export interface ReservationFormData {
  vehicleType: string;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate: string;
  vehicleModel: string;
  paymentMethod: string;
  language?: string; // Agregado para enviar el idioma
}
export interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}

export function useReservationForm(
  t: (key: string) => string,
  countryOptions: CountryOption[],
  locale: string
) {
  // Subhooks para dividir responsabilidades
  const steps = useReservationSteps();
  const formState = useReservationFormState(countryOptions);
  const availability = useReservationAvailability(t);
  const price = useReservationPrice();
  const submission = useReservationSubmission(t);
  const { vehicleTypes } = useReservationVehicleTypes();

  // Handlers que conectan los subhooks
  const handleSelectChange = (name: string, value: string) => {
    formState.handleSelectChange(name, value, availability.markNeedsRecheck);
  };

  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => {
    formState.handleDateChange(name, date, availability.markNeedsRecheck);
  };

  const checkAvailability = async () => {
    await availability.checkAvailability(
      formState.start_time,
      formState.end_time,
      formState.formData.vehicleType
    );
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
    
    // Estados de disponibilidad
    availability: availability.availability,
    checking: availability.checking,
    slotDetails: availability.slotDetails,
    hasCheckedAvailability: availability.hasCheckedAvailability,
    needsRecheck: availability.needsRecheck,
    availabilityError: availability.availabilityError,
    isCurrentDataSameAsLastChecked: availability.isCurrentDataSameAsLastChecked,
    
    // Estados de precio
    totalPrice: price.totalPrice,
    
    // Datos de vehículos
    vehicleTypes,
    
    // Handlers
    handleChange: formState.handleChange,
    handleSelectChange,
    handleDateChange,
    fetchTotalPrice,
    checkAvailability,
    
    // Funciones del flujo principal
    nextStep,
    prevStep,
    handlePrint,
    handleReservation,
  };
}
