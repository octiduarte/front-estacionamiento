import { useState, useEffect } from "react";
import { format } from "date-fns";
import { convertItalyToUTC } from "@/lib/italy-time";
import { ReservationFormData, CountryOption } from "@/types/reservation";

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
  
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>( //Estado de selección del país
    countryOptions.find((c) => c.iso2 === "it") || countryOptions[0]
  );

  // Estados de disponibilidad replicados del admin
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);

  // Timer para availability (replicado del admin)
  const [timer, setTimer] = useState<number>(0);
  
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
  };

  // Inicia el contador cuando availability es true
  useEffect(() => {
    if (availability === true) {
      setTimer(300); // 5 minutos
    } else {
      setTimer(0);
    }
  }, [availability]);

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
    timer,
    setTimer,
    start_time,
    end_time,
    handleChange,
    handleSelectChange,
    handleDateChange,
  };
}
