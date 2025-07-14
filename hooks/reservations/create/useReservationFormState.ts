import { useState } from "react";
import { format } from "date-fns";
import { convertItalyToUTC } from "@/lib/italy-time";
import { ReservationFormData, CountryOption } from "./useReservationForm";

export function useReservationFormState(countryOptions: CountryOption[]) {
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
    paymentMethod: "",
  });

  const [entryDateObj, setEntryDateObj] = useState<Date | undefined>(undefined);
  const [exitDateObj, setExitDateObj] = useState<Date | undefined>(undefined);
  
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    countryOptions.find((c) => c.iso2 === "it") || countryOptions[0]
  );
  
  // Función simplificada usando utilidad unificada
  const toUTCISOString = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return "";
    
    // Usar la utilidad centralizada
    return convertItalyToUTC(dateStr, timeStr);
  };

  // Calculated unified ISO strings for start and end time (convertidos de Italia a UTC)
  const start_time = toUTCISOString(formData.entryDate, formData.entryTime);
  const end_time = toUTCISOString(formData.exitDate, formData.exitTime);

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
  const handleSelectChange = (
    name: string, 
    value: string, 
    onAvailabilityChange?: () => void
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Si ya se checkeó disponibilidad y cambia el tipo de vehículo, marcar que necesita recheck
    if (onAvailabilityChange && (name === 'vehicleType' || name === 'entryTime' || name === 'exitTime')) {
      onAvailabilityChange();
    }
  };

  // Manejo de cambios en los calendarios (fechas)
  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined,
    onAvailabilityChange?: () => void
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
    
    // Si ya se checkeó disponibilidad y cambia alguna fecha, marcar que necesita recheck
    if (onAvailabilityChange) {
      onAvailabilityChange();
    }
  };

  return {
    formData,
    setFormData,
    entryDateObj,
    setEntryDateObj,
    exitDateObj,
    setExitDateObj,
    selectedCountry,
    setSelectedCountry,
    start_time,
    end_time,
    handleChange,
    handleSelectChange,
    handleDateChange,
  };
}
