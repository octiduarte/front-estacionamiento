import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import UnavailableSlotsList from "../UnavailableSlotsList";
import { CheckCircle2Icon } from "lucide-react";
import { addHours, isBefore, isAfter } from "date-fns";
import SimpleDateTimePicker from "../form/SimpleDateTimePicker";
import VehicleTypeSelector from "../form/VehicleTypeSelector";
import { toast } from "sonner";
import {
  getCurrentItalyTime,
  getMinSelectableDateInItaly,
  createItalyDateTime,
  isDateTimeInPast
} from "@/lib/italy-time";

interface Step1Props {
  t: (key: string) => string;
  formData: any;
  entryDateObj: Date | undefined;
  exitDateObj: Date | undefined;
  vehicleTypes: { id: number; name: string }[];
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => void;
  checkAvailability: () => Promise<void>;
  checking: boolean;
  availability: boolean | null;
  slotDetails: {
    start_time: string;
    end_time: string;
    is_available: boolean;
    available_spaces: number;
  }[];
  error: string;
  nextStep: () => void;
  hasCheckedAvailability: boolean;
  needsRecheck: boolean;
  isCurrentDataSameAsLastChecked: (
    start_time: string,
    end_time: string,
    vehicleType: string
  ) => boolean;
  start_time: string;
  end_time: string;
}

const Step1: React.FC<Step1Props> = ({
  t,
  formData,
  entryDateObj,
  exitDateObj,
  vehicleTypes,
  handleSelectChange,
  handleDateChange,
  checkAvailability,
  checking,
  availability,
  slotDetails,
  error,
  nextStep,
  hasCheckedAvailability,
  needsRecheck,
  isCurrentDataSameAsLastChecked,
  start_time,
  end_time,
}) => {
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<string[]>([]);
  const unavailableSlotsRef = useRef<HTMLDivElement>(null);

  // Usar las utilidades de tiempo de Italia para evitar conflictos con hora local
  const minSelectableDate = getMinSelectableDateInItaly();

  // Validaciones automáticas
  useEffect(() => {
    const newErrors: string[] = []

    if (entryDateObj && formData.entryTime && exitDateObj && formData.exitTime) {
      // Validar que la fecha/hora de entrada no sea en el pasado (basado en Italia con CET/CEST automático)
      if (isDateTimeInPast(entryDateObj, formData.entryTime)) {
        newErrors.push(t("entryDateTimeCannotBePast"))
      }

      // Crear objetos Date completos para comparación usando la zona horaria de Italia
      const entryDateTime = createItalyDateTime(entryDateObj, formData.entryTime);
      const exitDateTime = createItalyDateTime(exitDateObj, formData.exitTime);

      // Validar que la salida sea después de la entrada
      if (!isAfter(exitDateTime, entryDateTime)) {
        newErrors.push(t("exitDateTimeMustBeAfterEntry"))
      }
    }

    setErrors(newErrors)
  }, [entryDateObj, formData.entryTime, exitDateObj, formData.exitTime, t])

  // Auto-ajuste de fecha y hora de salida
  useEffect(() => {
    if (entryDateObj && formData.entryTime) {
      // Auto-seleccionar fecha de salida si no está seleccionada
      if (!exitDateObj) {
        handleDateChange("exitDate", entryDateObj)
      }

      // Si la fecha de salida es la misma que la de entrada, ajustar la hora de salida
      if (exitDateObj && entryDateObj.toDateString() === exitDateObj.toDateString()) {
        const entryHour = Number.parseInt(formData.entryTime.split(":")[0])
        const currentExitHour = formData.exitTime ? Number.parseInt(formData.exitTime.split(":")[0]) : -1

        // Si la hora de salida actual es menor o igual a la de entrada, seleccionar la siguiente hora
        if (currentExitHour <= entryHour) {
          const nextHour = entryHour + 1
          if (nextHour < 24) {
            handleSelectChange("exitTime", nextHour.toString().padStart(2, "0") + ":00")
          } else {
            // Si no hay más horas en el día, cambiar al día siguiente a las 00:00
            const nextDay = new Date(entryDateObj)
            nextDay.setDate(nextDay.getDate() + 1)
            handleDateChange("exitDate", nextDay)
            handleSelectChange("exitTime", "00:00")
          }
        }
      }
    }
  }, [entryDateObj, formData.entryTime, exitDateObj, formData.exitTime, handleDateChange, handleSelectChange])

  // Mostrar toast de éxito cuando haya disponibilidad
  useEffect(() => {
    if (availability === true) {
      toast.success(t("slotAvailable"), {
        description: t("slotAvailableDescription"),
      });
    }
  }, [availability, t]);

  // Mostrar toast de warning cuando se necesite re-verificar disponibilidad (solo en mobile)
  useEffect(() => {
    if (hasCheckedAvailability && needsRecheck) {
        toast.warning(t("recheckAvailabilityRequired"));
    }
  }, [hasCheckedAvailability, needsRecheck, t]);

  // Mostrar toast de error cuando no haya disponibilidad
  useEffect(() => {
    if (availability === false && slotDetails.length > 0) {
      toast.error(t("noSlotsAvailable"), {
        description: t("noSlotsAvailableDescription"),
      });
      
      // Hacer scroll hacia la sección de horarios no disponibles
      setTimeout(() => {
        unavailableSlotsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [availability, slotDetails, t]);

  // Manejar cambio de hora de entrada con lógica especial para 23:00
  const handleEntryTimeChange = (value: string) => {
    handleSelectChange("entryTime", value);

    // Si la hora de entrada es 23:00 y la fecha de salida es la misma que la de entrada,
    // automáticamente cambiar la fecha de salida al día siguiente
    if (value === "23:00" && formData.entryDate && formData.exitDate) {
      const entryDate = new Date(formData.entryDate);
      const exitDate = new Date(formData.exitDate);

      // Si las fechas son iguales, cambiar la fecha de salida al día siguiente
      if (entryDate.toDateString() === exitDate.toDateString()) {
        const nextDay = new Date(entryDate);
        nextDay.setDate(nextDay.getDate() + 1);
        handleDateChange("exitDate", nextDay);
        handleSelectChange("exitTime", "00:00");
      }
    }
  };

  useEffect(() => {
    const typeFromQuery = searchParams.get("type");
    if (typeFromQuery && !formData.vehicleType) {
      handleSelectChange("vehicleType", typeFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid = formData.vehicleType && entryDateObj && formData.entryTime && exitDateObj && formData.exitTime && errors.length === 0;

  // Verificar si los datos actuales son los mismos que los últimos chequeados
  const isDataSameAsLastChecked = isCurrentDataSameAsLastChecked(
    start_time,
    end_time,
    formData.vehicleType
  );

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        {/* Tipo de Vehículo */}
        <VehicleTypeSelector
          t={t}
          vehicleTypes={vehicleTypes}
          selectedType={formData.vehicleType}
          onTypeChange={(value) => handleSelectChange("vehicleType", value)}
        />

        {/* Fecha y Hora de Entrada */}
        <SimpleDateTimePicker
          t={t}
          dateLabel={t("entryDate")}
          timeLabel={t("entryTime")}
          dateValue={entryDateObj}
          timeValue={formData.entryTime}
          onDateChange={(date) => handleDateChange("entryDate", date)}
          onTimeChange={handleEntryTimeChange}
          minSelectableDate={minSelectableDate}
        />

        {/* Fecha y Hora de Salida */}
        <SimpleDateTimePicker
          t={t}
          dateLabel={t("exitDate")}
          timeLabel={t("exitTime")}
          dateValue={exitDateObj}
          timeValue={formData.exitTime}
          onDateChange={(date) => handleDateChange("exitDate", date)}
          onTimeChange={(value) => handleSelectChange("exitTime", value)}
          disabled={!(formData.entryDate && formData.entryTime)}
          minSelectableDate={minSelectableDate}
          isExitPicker={true}
          entryDate={entryDateObj}
          entryTime={formData.entryTime}
        />

        {/* Errores de validación */}
        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <span key={index} className="block text-sm text-destructive">{error}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Error del servidor si la fecha salida es mayor a la fecha de entrada */}
        {error && (
          <span className="text-sm text-destructive mt-1 block">{error}</span>
        )}

        <Button
          onClick={checkAvailability}
          disabled={!isFormValid || checking || isDataSameAsLastChecked}
          variant="secondary"
        >
          {checking ? t("checkingAvailability") : t("checkAvailability")}
        </Button>

        {/* Alerta para indicar que se necesita re-verificar disponibilidad */}
        {hasCheckedAvailability && needsRecheck && (
          <Alert
            variant="default"
            className="flex items-center gap-2 bg-accent/20 border-accent text-accent-foreground mt-5"
          >
            <Info className="w-5 h-5 text-accent-foreground" />
            <span>{t("recheckAvailabilityRequired")}</span>
          </Alert>
        )}

        {/* Mensaje de disponibilidad o no disponibilidad y lista de horarios no disponibles */}
        {availability === false && slotDetails.length > 0 && (
          <div ref={unavailableSlotsRef}>
            <UnavailableSlotsList slotDetails={slotDetails} t={t} />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={
            !(
              formData.vehicleType &&
              formData.entryDate &&
              formData.entryTime &&
              formData.exitDate &&
              formData.exitTime &&
              availability === true &&
              !needsRecheck
            )
          }
        >
          {t("next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default Step1;
