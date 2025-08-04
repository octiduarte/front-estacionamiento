import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import UnavailableSlotsList from "../UnavailableSlotsList";
import { isAfter } from "date-fns";
import SimpleDateTimePicker from "../form/SimpleDateTimePicker";
import VehicleTypeSelector from "../form/VehicleTypeSelector";
import { toast } from "sonner";
import {
  getMinSelectableDateInItaly,
  createItalyDateTime,
} from "@/lib/italy-time";
import { ReservationFormData } from "@/types/reservation";
import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "@/lib/reservations/create/getVehicleTypes";
import { getAvailability } from "@/lib/reservations/create/getAvailability";
import { getVehicleTypeId } from "@/hooks/reservations/create/constants";
import { Alert } from "@/components/ui/alert";
import { Info, Loader2, CheckCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Step1Props {
  t: (key: string) => string;
  formData: ReservationFormData;
  entryDateObj: Date | undefined;
  exitDateObj: Date | undefined;
  availability: boolean | null;
  setAvailability: (availability: boolean | null) => void;
  slotDetails: any[];
  setSlotDetails: (slotDetails: any[]) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => void;
  nextStep: () => void;
  start_time: string;
  end_time: string;
  slotAvailableToastRef?: React.MutableRefObject<boolean>;
}

const Step1 = ({
  t,
  formData,
  entryDateObj,
  exitDateObj,
  availability,
  setAvailability,
  slotDetails,
  setSlotDetails,
  handleSelectChange,
  handleDateChange,
  nextStep,
  start_time,
  end_time,
  slotAvailableToastRef,
}: Step1Props) => {
  const searchParams = useSearchParams();
  const unavailableSlotsRef = useRef<HTMLDivElement>(null);

  // Trae la Fecha actual en Italia pero con 00:00:00 como hora
  const minSelectableDate = getMinSelectableDateInItaly();

  // Query para obtener los tipos de vehículos
  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  // Función para validar que las fechas sean correctas usando objetos Date completos
  const isDateTimeValid = (): boolean => {
    if (
      !entryDateObj ||
      !formData.entryTime ||
      !exitDateObj ||
      !formData.exitTime
    ) {
      return false;
    }

    const entryDateTime = createItalyDateTime(entryDateObj, formData.entryTime);
    const exitDateTime = createItalyDateTime(exitDateObj, formData.exitTime);

    return isAfter(exitDateTime, entryDateTime);
  };

  // Query para verificar disponibilidad
  const {
    data: availabilityData,
    isLoading: checking,
    error: availabilityError,
    refetch: checkAvailability,
  } = useQuery({
    queryKey: ["availability", start_time, end_time, formData.vehicleType],
    queryFn: async () => {
      const vehicleTypeId = getVehicleTypeId(formData.vehicleType);
      return getAvailability({
        startTime: start_time,
        endTime: end_time,
        vehicleTypeId,
      });
    },
    enabled: false, // Solo se ejecuta manualmente con refetch
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });

  // Actualizar estados cuando cambian los datos de disponibilidad
  useEffect(() => {
    if (availabilityData) {
      setAvailability(availabilityData.is_overall_available);
      setSlotDetails(availabilityData.slot_details || []);
    }
  }, [availabilityData, setAvailability, setSlotDetails]);

  const error = availabilityError ? String(availabilityError) : "";

  const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null);
  const currentKey = [formData.vehicleType, start_time, end_time].join("|");
  const shouldShowRecheckAlert =
    lastCheckedKey !== null &&
    currentKey !== lastCheckedKey &&
    availability !== true;

  useEffect(() => {
    // Validación en tiempo real para mostrar toast inmediatamente
    if (
      entryDateObj &&
      formData.entryTime &&
      exitDateObj &&
      formData.exitTime
    ) {
      const entryDateTime = createItalyDateTime(entryDateObj, formData.entryTime);
      const exitDateTime = createItalyDateTime(exitDateObj, formData.exitTime);

      if (!isAfter(exitDateTime, entryDateTime)) {
        toast.error(t("exitDateTimeMustBeAfterEntry"));
      }
    }
    // Ahora también depende de formData.vehicleType
  }, [
    entryDateObj,
    formData.entryTime,
    exitDateObj,
    formData.exitTime,
    formData.vehicleType,
    t,
  ]);

  // Mostrar toast de éxito y guardar la key cuando haya disponibilidad
  useEffect(() => {
    if (availability === true) {
      setLastCheckedKey(currentKey);
      if (!slotAvailableToastRef || !slotAvailableToastRef.current) {
        toast.success(t("slotAvailable"), {
          description: t("slotAvailableDescription"),
        });
        if (slotAvailableToastRef) slotAvailableToastRef.current = true;
      }
    } else if (availability === false && slotAvailableToastRef) {
      // Resetear la ref si cambia a no disponible
      slotAvailableToastRef.current = false;
    }
  }, [availability, t, currentKey, slotAvailableToastRef]);

  // Mostrar toast.warning cuando se debe mostrar el Alert de re-chequeo
  useEffect(() => {
    if (shouldShowRecheckAlert && isDateTimeValid()) {
      toast.warning(t("recheckAvailabilityRequired"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowRecheckAlert]);

  // Mostrar toast de error cuando no haya disponibilidad
  useEffect(() => {
    if (availability === false && slotDetails.length > 0) {
      toast.error(t("noSlotsAvailable"), {
        description: t("noSlotsAvailableDescription"),
      });

      // Hacer scroll hacia la sección de horarios no disponibles
      setTimeout(() => {
        unavailableSlotsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [availability, slotDetails, t]);

  useEffect(() => {
    const typeFromQuery = searchParams.get("type");
    if (typeFromQuery && !formData.vehicleType) {
      handleSelectChange("vehicleType", typeFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid =
    formData.vehicleType &&
    entryDateObj &&
    formData.entryTime &&
    exitDateObj &&
    formData.exitTime &&
    isDateTimeValid();

  // Función para manejar el click del botón de verificar disponibilidad
  const handleCheckAvailability = () => {
    // Solo hacer fetch si las fechas son válidas
    if (isDateTimeValid()) {
      checkAvailability();
    } 
  };

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
        <VehicleTypeSelector
          t={t}
          vehicleTypes={vehicleTypes}
          selectedType={formData.vehicleType}
          onTypeChange={(value) => handleSelectChange("vehicleType", value)}
        />

        {/* Fecha de Entrada */}
        <SimpleDateTimePicker
          t={t}
          dateLabel={t("entryDate")}
          timeLabel={t("entryTime")}
          dateValue={entryDateObj}
          timeValue={formData.entryTime}
          onDateChange={(date) => handleDateChange("entryDate", date)}
          onTimeChange={(value) => handleSelectChange("entryTime", value)}
          minSelectableDate={minSelectableDate}
          // Solo habilita el selector de hora si hay fecha de entrada
          // Pasa una prop extra para controlar el estado del selector de hora
          timeDisabled={!entryDateObj}
        />

        <Separator />

        {/* Fecha y Hora de Salida */}
        <SimpleDateTimePicker
          t={t}
          dateLabel={t("exitDate")}
          timeLabel={t("exitTime")}
          dateValue={exitDateObj}
          timeValue={formData.exitTime}
          onDateChange={(date) => handleDateChange("exitDate", date)}
          onTimeChange={(value) => handleSelectChange("exitTime", value)}
          disabled={
            !formData.vehicleType || !entryDateObj || !formData.entryTime
          }
          minSelectableDate={entryDateObj}
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Error del servidor si la fecha salida es mayor a la fecha de entrada */}
        {error && (
          <span className="text-sm text-destructive mt-1 block">{error}</span>
        )}

        <Button
          onClick={handleCheckAvailability}
          disabled={!isFormValid || checking}
          variant={availability === true ? "default" : availability === false ? "destructive" : "secondary"}
        >
          {checking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("checkingAvailability")}
            </>
          ) : availability === true ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {t("available")}
            </>
          ) : availability === false ? (
            <>
              <X className="h-4 w-4 mr-2" />
              {t("unavailable")}
            </>
          ) : (
            t("checkAvailability")
          )}
        </Button>
        {shouldShowRecheckAlert &&
          isDateTimeValid() &&
           (
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
              availability === true
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
