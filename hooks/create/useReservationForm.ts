import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAvailability } from "@/lib/reservations/getAvailability";
import { getVehicleTypes } from "@/lib/reservations/getVehicleTypes";
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

  const { data: vehicleTypes = [], error: errorVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: Infinity,
  });


  {/* Validación de tiempo de entrada y salida */}
  const isTimeValid = (
    entryDate: string,
    entryTime: string,
    exitDate: string,
    exitTime: string
  ): boolean => {
    const entry = new Date(`${entryDate}T${entryTime}:00Z`);
    const exit = new Date(`${exitDate}T${exitTime}:00Z`);
    return exit > entry;
  };


  {/* Manejo de cambios en los campos del formulario */}
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (
        name === "entryDate" ||
        name === "entryTime" ||
        name === "exitDate" ||
        name === "exitTime"
      ) {
        const { entryDate, entryTime, exitDate, exitTime } = updatedFormData;
        if (
          entryDate &&
          entryTime &&
          exitDate &&
          exitTime &&
          !isTimeValid(entryDate, entryTime, exitDate, exitTime)
        ) {
          setError(t("exitTimeError"));
        } else {
          setError("");
        }
      }
      return updatedFormData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
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
      const vehicleTypeMap: Record<string, number> = { car: 1, motorcycle: 2, suv: 3 };
      const vehicleTypeId =
        vehicleTypeMap[formData.vehicleType as keyof typeof vehicleTypeMap] || 0;
      const data = await getAvailability({
        startTime: `${formData.entryDate}T${formData.entryTime}:00Z`,
        endTime: `${formData.exitDate}T${formData.exitTime}:00Z`,
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      entryDate: entryDateObj ? format(entryDateObj, "yyyy-MM-dd") : "",
      exitDate: exitDateObj ? format(exitDateObj, "yyyy-MM-dd") : "",
    }));
  }, [entryDateObj, exitDateObj]);

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
    setCurrentStep,
    formData,
    setFormData,
    reservationCode,
    setReservationCode,
    entryDateObj,
    setEntryDateObj,
    exitDateObj,
    setExitDateObj,
    availability,
    setAvailability,
    checking,
    setChecking,
    error,
    setError,
    submitting,
    setSubmitting,
    slotDetails,
    setSlotDetails,
    selectedCountry,
    setSelectedCountry,
    vehicleTypes,
    errorVehicleTypes,
    handleChange,
    handleSelectChange,
    nextStep,
    prevStep,
    handlePrint,
    checkAvailability,
    handleReservation,
  };
}
