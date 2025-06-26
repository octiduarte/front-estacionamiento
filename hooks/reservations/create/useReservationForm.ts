import { useState } from "react";
import { useReservationFormState } from "./useReservationFormState";
import { useReservationAvailability } from "./useReservationAvailability";
import { useReservationPrice } from "./useReservationPrice";
import { useReservationVehicleTypes } from "./useReservationVehicleTypes";

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
}
export interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}

export function useReservationForm(
  t: (key: string) => string,
  countryOptions: CountryOption[]
) {
  // Estados del flujo principal
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reservationCode, setReservationCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Subhooks
  const formState = useReservationFormState(countryOptions);
  const availability = useReservationAvailability(t);
  const price = useReservationPrice();
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
      formState.formData.vehicleType,
      setError
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
    if (currentStep === 2) {
      await fetchTotalPrice();
    }
    if (currentStep === 2) {
      console.log("Datos completos del formulario:", formState.formData);
      console.log("País seleccionado:", formState.selectedCountry);
    }
    if (currentStep === 3) {
      const mockReservationCode =
        "PK" +
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
      setReservationCode(mockReservationCode);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReservation = async () => {
    setSubmitting(true);
    setError("");
    try {
      setCurrentStep(4);
    } catch (e) {
      setError("Error al procesar la reserva");
    }
    setSubmitting(false);
  };

  return {
    // Estados del flujo principal
    currentStep,
    reservationCode,
    error,
    submitting,
    
    // Estados del formulario
    formData: formState.formData,
    setFormData: formState.setFormData,
    entryDateObj: formState.entryDateObj,
    setEntryDateObj: formState.setEntryDateObj,
    exitDateObj: formState.exitDateObj,
    setExitDateObj: formState.setExitDateObj,
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

// Utilidad para armar el payload final de la reserva
export function buildReservationPayload(
  formData: ReservationFormData,
  selectedCountry: CountryOption,
  start_time: string,
  end_time: string
) {
  // Map string values to IDs as expected by backend
  const vehicleTypeMap: Record<string, number> = { car: 1, motorcycle: 2, suv: 3 };
  const paymentMethodMap: Record<string, number> = { cash: 1, creditCard: 2 };

  return {
    user_name: `${formData.firstName} ${formData.lastName}`.trim(),
    user_email: formData.email,
    user_phone: `+${selectedCountry.dialCode}${formData.phone}`,
    vehicle_type_id: vehicleTypeMap[formData.vehicleType] || 0,
    payment_method_id: paymentMethodMap[formData.paymentMethod] || 0,
    vehicle_plate: formData.licensePlate,
    vehicle_model: formData.vehicleModel,
    start_time,
    end_time,
  };
}
