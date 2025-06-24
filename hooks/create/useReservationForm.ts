import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAvailability } from "@/lib/reservations/getAvailability";
import { getVehicleTypes } from "@/lib/reservations/getVehicleTypes";
import { getTotalPrice } from "@/lib/reservations/getTotalPrice";
import { useQuery } from "@tanstack/react-query";

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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ReservationFormData>({
    vehicleType: "",
    entryDate: "",
    entryTime: "",
    exitDate: "",
    exitTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licensePlate: "",
    vehicleModel: "",
    paymentMethod: "cash",
  });
  const [reservationCode, setReservationCode] = useState<string>("");
  const [entryDateObj, setEntryDateObj] = useState<Date | undefined>(undefined);
  const [exitDateObj, setExitDateObj] = useState<Date | undefined>(undefined);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    countryOptions.find((c) => c.iso2 === "ar") || countryOptions[0]
  );
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const { data: vehicleTypes = [], error: errorVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: Infinity,
  });

  // Calculated unified ISO strings for start and end time
  const start_time =
    formData.entryDate && formData.entryTime
      ? `${formData.entryDate}T${formData.entryTime}:00Z`
      : "";
  const end_time =
    formData.exitDate && formData.exitTime
      ? `${formData.exitDate}T${formData.exitTime}:00Z`
      : "";

  /* Devuelve un true si la fecha de salida es mayor a la de entrada */

  const isTimeValid = (
    entryDate: string,
    entryTime: string,
    exitDate: string,
    exitTime: string
  ): boolean => {
    const entry = new Date(start_time);
    const exit = new Date(end_time);
    return exit > entry;
  };

  /* Manejo de cambios en los campos del formulario */

  // Manejo de cambios en los campos del formulario (inputs y textareas)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo de cambios en selects personalizados
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de cambios en los calendarios (fechas)
  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => {
    if (name === "entryDate") {
      setEntryDateObj(date);
      setFormData((prev) => ({
        ...prev,
        entryDate: date ? format(date, "yyyy-MM-dd") : "",
      }));
    } else if (name === "exitDate") {
      setExitDateObj(date);
      setFormData((prev) => ({
        ...prev,
        exitDate: date ? format(date, "yyyy-MM-dd") : "",
      }));
    }
  };

  const fetchTotalPrice = async () => {
    try {
      const vehicleTypeMap: Record<string, number> = {
        car: 1,
        motorcycle: 2,
        suv: 3,
      };
      const vehicleTypeId =
        vehicleTypeMap[formData.vehicleType as keyof typeof vehicleTypeMap] ||
        0;
      const price = await getTotalPrice({
        vehicleTypeId,
        startTime: start_time,
        endTime: end_time,
      });
      setTotalPrice(price);
    } catch (e) {
      setTotalPrice(null);
    }
  };

  const nextStep = async () => {
    if (currentStep === 2) {
      await fetchTotalPrice();
    }
    if (currentStep === 2) {
      console.log("Datos completos del formulario:", formData);
      console.log("País seleccionado:", selectedCountry);
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

  const checkAvailability = async () => {
    setChecking(true);
    setError("");
    try {
      if (
        !isTimeValid(
          formData.entryDate,
          formData.entryTime,
          formData.exitDate,
          formData.exitTime
        )
      ) {
        setError(t("exitTimeError"));
        setAvailability(null);
        setSlotDetails([]);
        setChecking(false);
        return;
      }
      const vehicleTypeMap: Record<string, number> = {
        car: 1,
        motorcycle: 2,
        suv: 3,
      };
      const vehicleTypeId =
        vehicleTypeMap[formData.vehicleType as keyof typeof vehicleTypeMap] ||
        0;
      const data = await getAvailability({
        startTime: start_time,
        endTime: end_time,
        vehicleTypeId,
      });
      setAvailability(data.is_overall_available);
      setSlotDetails(data.slot_details || []);
    } catch (error) {
      setError("Error checking availability:" + error);
    } finally {
      setChecking(false);
    }
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

  // Persistencia de formulario multi-step con localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem("reservationForm");
    const savedCountry = localStorage.getItem("reservationCountry");
    const savedStep = localStorage.getItem("reservationStep");
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedCountry) setSelectedCountry(JSON.parse(savedCountry));
    if (savedStep) setCurrentStep(Number(savedStep));
  }, []);

  useEffect(() => {
    localStorage.setItem("reservationForm", JSON.stringify(formData));
    localStorage.setItem("reservationCountry", JSON.stringify(selectedCountry));
    localStorage.setItem("reservationStep", String(currentStep));
  }, [formData, selectedCountry, currentStep]);

  return {
    currentStep,
    formData,
    setFormData,
    reservationCode,
    entryDateObj,
    setEntryDateObj,
    exitDateObj,
    setExitDateObj,
    availability,
    checking,
    error,
    submitting,
    slotDetails,
    selectedCountry,
    setSelectedCountry,
    vehicleTypes,
    totalPrice,
    fetchTotalPrice,
    handleChange,
    handleSelectChange,
    handleDateChange,
    nextStep,
    prevStep,
    handlePrint,
    checkAvailability,
    handleReservation,
    start_time,
    end_time,
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
