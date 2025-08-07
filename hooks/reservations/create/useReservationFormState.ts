import { useState, useEffect } from "react";
import React from "react";
import { format } from "date-fns";
import { convertItalyToUTC } from "@/lib/italy-time";
import { ReservationFormData, CountryOption } from "@/types/reservation";

export function useReservationFormState(countryOptions: CountryOption[]) {
  const [formData, setFormData] = useState<ReservationFormData>({
    vehicleType: 0,
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
    paymentMethod: 0,
  });

  const [entryDateObj, setEntryDateObj] = useState<Date | undefined>(undefined);
  const [exitDateObj, setExitDateObj] = useState<Date | undefined>(undefined);
  
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>( //Estado de selección del país
    countryOptions.find((c) => c.iso2 === "it") || countryOptions[0]
  );

  // Estados de disponibilidad replicados del admin
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null);

  // Estado para campos tocados
  const [touched, setTouched] = useState({
    licensePlate: false,
    vehicleModel: false,
  });

  // Timer para availability (replicado del admin)
  const [timer, setTimer] = useState<number>(0);
  
  const start_time = formData.entryDate && formData.entryTime ? convertItalyToUTC(formData.entryDate, formData.entryTime) : "";
  const end_time = formData.exitDate && formData.exitTime ? convertItalyToUTC(formData.exitDate, formData.exitTime) : "";

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
    value: string | number, 
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Resetear availability cuando se cambian campos críticos
    if ([
      "vehicleType",
      "entryDate", 
      "entryTime",
      "exitDate",
      "exitTime"
    ].includes(name)) {
      setAvailability(null);
      setSlotDetails([]);
      setTimer(0); // Resetear timer también
      setLastCheckedKey(null); // Resetear key de último chequeo
    }
  };

  // Manejo de cambios en los calendarios (fechas)
  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined,
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
    
    // Resetear availability cuando se cambian las fechas 
    setAvailability(null);
    setSlotDetails([]);
    setTimer(0); // Resetear timer también
    setLastCheckedKey(null); // Resetear key de último chequeo
  };

  // Inicia el contador cuando availability es true
  useEffect(() => {
    if (availability === true) {
      setTimer(3040); // 5 minutos
    } else {
      setTimer(0);
    }
  }, [availability]);

  // Validaciones de formulario
  const isEmailValid = (email: string) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email);
  const isNameValid = (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/.test(name);
  const isPhoneValid = (phone: string) => /^\d{7,}$/.test(phone);

  // Handler para campos tocados
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
    availability,
    setAvailability,
    slotDetails,
    setSlotDetails,
    lastCheckedKey,
    setLastCheckedKey,
    timer,
    setTimer,
    start_time,
    end_time,
    handleChange,
    handleSelectChange,
    handleDateChange,
    isEmailValid,
    isNameValid,
    isPhoneValid,
    touched,
    handleBlur,
  };
}
