import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { getMinSelectableDateInItaly, createItalyDateTime, convertItalyToUTC } from "@/lib/italy-time";
import { isAfter } from "date-fns";
import { toast } from "sonner";
import countryData from "country-telephone-data";

const countryOptions = (
  countryData.allCountries as Array<{
    name: string;
    dialCode: string;
    iso2: string;
  }>
).map((country) => ({
  name: country.name,
  dialCode: country.dialCode,
  iso2: country.iso2,
}));

export interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}

export interface FormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  vehicle_type_id: number | undefined;
  vehicle_plate: string;
  vehicle_model: string;
  entryDate: Date | undefined;
  entryTime: string;
  exitDate: Date | undefined;
  exitTime: string;
}
export function useCreateDashboardReservation() {
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    user_email: "",
    user_phone: "",
    vehicle_type_id: undefined,
    vehicle_plate: "",
    vehicle_model: "",
    entryDate: undefined,
    entryTime: "",
    exitDate: undefined,
    exitTime: "",
  });
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    countryOptions.find((c) => c.iso2 === "it") || countryOptions[0]
  );
  const [touched, setTouched] = useState({
    vehicle_plate: false,
    vehicle_model: false,
  });

  // Get minimum selectable date in Italy timezone
  const minSelectableDate = getMinSelectableDateInItaly();

  // Get token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);
  // Transforma la fecha Y hora de entrada y salida a formato UTC
  const start_time =
    formData.entryDate && formData.entryTime
      ? convertItalyToUTC(formData.entryDate, formData.entryTime)
      : "";

  const end_time =
    formData.exitDate && formData.exitTime
      ? convertItalyToUTC(formData.exitDate, formData.exitTime)
      : "";

  // Reset form
  const resetForm = () => {
    setFormData({
      user_name: "",
      user_email: "",
      user_phone: "",
      vehicle_type_id: undefined,
      vehicle_plate: "",
      vehicle_model: "",
      entryDate: undefined,
      entryTime: "",
      exitDate: undefined,
      exitTime: "",
    });
    setAvailability(null);
    setAvailabilityChecked(false);
    setSlotDetails([]);
    setTouched({ vehicle_plate: false, vehicle_model: false });
  };
  // Utilidad para obtener los objetos Date de entrada y salida en horario italiano
  const getEntryAndExitDateTime = () => {
    if (
      !formData.entryDate ||
      !formData.entryTime ||
      !formData.exitDate ||
      !formData.exitTime
    ) {
      return { entryDateTime: null, exitDateTime: null };
    }
    const entryDateTime = createItalyDateTime(formData.entryDate, formData.entryTime);
    const exitDateTime = createItalyDateTime(formData.exitDate, formData.exitTime);
    return { entryDateTime, exitDateTime };
  };

  // Checkea si las fechas y horas son válidas
  const isDateTimeValid = (): boolean => {
    const { entryDateTime, exitDateTime } = getEntryAndExitDateTime();
    if (!entryDateTime || !exitDateTime) return false;
    return isAfter(exitDateTime, entryDateTime);
  };
  // Toast de error si la fecha/hora de entrada es mayor o igual a la de salida
  useEffect(() => {
    const { entryDateTime, exitDateTime } = getEntryAndExitDateTime();
    if (entryDateTime && exitDateTime && !isAfter(exitDateTime, entryDateTime)) {
      toast.error("La data e ora di fine devono essere successive a quelle di inizio.");
    }
  }, [formData.entryDate, formData.entryTime, formData.exitDate, formData.exitTime]);

  // Handler para verificar disponibilidad (será pasado desde el componente)
  const createHandleCheckAvailability = (checkAvailabilityFn: () => void) => () => {
    setAvailabilityChecked(false);
    setAvailability(null);
    checkAvailabilityFn();
  };

  // Submit handler (será pasado desde el componente) 
  const createHandleSubmit = (submitFn: (data: any) => void, totalPrice: number) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability) {
      toast.error("Verifica prima la disponibilità");
      return;
    }
    const reservationData = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      user_phone: `+${selectedCountry.dialCode}${formData.user_phone}`,
      vehicle_type_id: Number(formData.vehicle_type_id),
      vehicle_plate: formData.vehicle_plate,
      vehicle_model: formData.vehicle_model,
      payment_method_id: 1,
      start_time: start_time,
      end_time: end_time,
      total_price: totalPrice,
      language: locale,
    };
    submitFn(reservationData);
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if ([
      "entryDate",
      "entryTime",
      "exitDate",
      "exitTime",
      "vehicle_type_id",
    ].includes(field)) {
      setAvailability(null);
      setAvailabilityChecked(false);
      setSlotDetails([]);
      if (availabilityChecked) {
        toast.info("Hai modificato i dati, controlla di nuovo la disponibilità.");
      }
    }
  };

  // Validaciones de inputos
  const isEmailValid = (email: string) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email);
  const isNameValid = (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/.test(name);
  const isPhoneValid = (phone: string) => /^\d{7,}$/.test(phone);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const canCheckAvailability =
    formData.entryDate &&
    formData.entryTime &&
    formData.exitDate &&
    formData.exitTime &&
    formData.vehicle_type_id &&
    isDateTimeValid();

  return {
    formData,
    setFormData,
    availability,
    setAvailability,
    availabilityChecked,
    setAvailabilityChecked,
    slotDetails,
    setSlotDetails,
    token,
    setToken,
    selectedCountry,
    setSelectedCountry,
    minSelectableDate,
    start_time,
    end_time,
    resetForm,
    getEntryAndExitDateTime,
    isDateTimeValid,
    createHandleCheckAvailability,
    createHandleSubmit,
    handleInputChange,
    isEmailValid,
    isNameValid,
    isPhoneValid,
    touched,
    setTouched,
    handleBlur,
    canCheckAvailability,
    locale,
  };
}
