import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Info,
  Car,
  Truck,
  Bike,
  Bus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import UnavailableSlotsList from "../UnavailableSlotsList";
import DateTimePicker from "../form/DateTimePicker";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

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
}) => {
  const searchParams = useSearchParams();

  // Función para manejar el cambio de hora de entrada
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
        // También limpiar la hora de salida para que el usuario la seleccione
        handleSelectChange("exitTime", "");
      }
    }
  };

  // Función para obtener el icono según el tipo de vehículo
  const getVehicleIcon = (
    vehicleTypeName: string,
    size: "sm" | "lg" = "sm",
    isSelected = false
  ) => {
    const name = vehicleTypeName.toLowerCase();
    const iconSize = size === "lg" ? "h-8 w-8" : "h-4 w-4";

    const selectedClass = isSelected ? "text-primary" : "text-gray-300";
    switch (name) {
      case "car":
        return <Car className={`${iconSize} ${selectedClass}`} />;
      case "motorcycle":
        return <Bike className={`${iconSize} ${selectedClass}`} />;
      case "suv":
        return <Truck className={`${iconSize} ${selectedClass}`} />;
      case "bus":
        return <Bus className={`${iconSize} ${selectedClass}`} />;
      default:
        return <Car className={`${iconSize} ${selectedClass}`} />; // Icono por defecto
    }
  };

  // Función para obtener el color del borde según el tipo de vehículo
  const getVehicleColor = (vehicleTypeName: string) => {
    // Todos iguales
    return "border-gray-700 bg-background hover:border-gray-500 text-gray-100";
  };

  useEffect(() => {
    const typeFromQuery = searchParams.get("type");
    if (typeFromQuery && !formData.vehicleType) {
      handleSelectChange("vehicleType", typeFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="vehicleType"
            className="text-base font-medium mb-4 block"
          >
            {t("vehicleType")}
          </Label>
          {/* Selector de vehículos con tarjetas */}
          <div className="flex flex-wrap justify-center gap-3">
            {vehicleTypes.map((type) => {
              const isSelected = formData.vehicleType === type.name;
              return (
                <div
                  key={type.id}
                  onClick={() => handleSelectChange("vehicleType", type.name)}
                  className={`
                    relative cursor-pointer rounded-xl border-2 p-2 transition-all duration-200
                    w-24 min-w-[88px] flex-shrink-0
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                        : `${getVehicleColor(type.name)} hover:shadow-sm`
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {getVehicleIcon(type.name, "lg", isSelected)}
                    <span
                      className={`text-xs font-medium text-center ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {t(type.name)}
                    </span>
                  </div>
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                      <CheckCircle2Icon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DateTimePicker
          t={t}
          dateLabel={t("entryDate")}
          timeLabel={t("entryTime")}
          dateValue={entryDateObj}
          timeValue={formData.entryTime}
          onDateChange={(date) => handleDateChange("entryDate", date)}
          onTimeChange={handleEntryTimeChange}
          placeholder={{
            date: t("selectDate"),
            time: t("selectTime"),
          }}
        />
        <DateTimePicker
          t={t}
          dateLabel={t("exitDate")}
          timeLabel={t("exitTime")}
          dateValue={exitDateObj}
          timeValue={formData.exitTime}
          onDateChange={(date) => handleDateChange("exitDate", date)}
          onTimeChange={(value) => handleSelectChange("exitTime", value)}
          disabled={!(formData.entryDate && formData.entryTime)}
          fromDate={entryDateObj || new Date()}
          minTime={
            formData.entryDate === formData.exitDate
              ? formData.entryTime
              : undefined
          }
          excludeMinTime={true} // Para fecha de salida: excluir la hora exacta de entrada
          placeholder={{
            date: t("selectDate"),
            time: t("selectTime"),
          }}
        />
      </div>{" "}
      <div className="flex flex-col gap-2">
        {/* Error si la fecha salida es mayor a la fecha de entrada (No realiza fetch)*/}
        {error && (
          <span className="text-sm text-red-600 mt-1 block">{error}</span>
        )}
        <Button
          onClick={checkAvailability}
          disabled={
            !formData.vehicleType ||
            !formData.entryDate ||
            !formData.entryTime ||
            !formData.exitDate ||
            !formData.exitTime ||
            checking
          }
          variant="secondary"
        >
          {checking ? t("checkingAvailability") : t("checkAvailability")}
        </Button>
        {/* Alerta para indicar que se necesita re-verificar disponibilidad */}
        {hasCheckedAvailability && needsRecheck && (
          <Alert
            variant="default"
            className="flex items-center gap-2 bg-warning/10 border-warning text-warning mt-5"
          >
            <Info className="w-5 h-5 text-warning" />
            <span>{t("recheckAvailabilityRequired")}</span>
          </Alert>
        )}
        {/* Mensaje de disponibilidad o no disponibilidad y lista de horarios no disponibles */}
        {availability === false && slotDetails.length > 0 && (
          <UnavailableSlotsList slotDetails={slotDetails} t={t} />
        )}
        {/* Mensaje de disponibilidad positiva */}
        {availability === true && (
          <Alert variant="default" className="border-primary text-primary mt-5">
            <CheckCircle2Icon className="w-5 h-5" />
            <AlertTitle>{t("slotAvailable")}</AlertTitle>
            <AlertDescription>{t("slotAvailableDescription")}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex justify-end">
        {" "}
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
