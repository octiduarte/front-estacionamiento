import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info, Car, Truck, Bike, Bus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import UnavailableSlotsList from "../UnavailableSlotsList";
import DateTimePicker from "../form/DateTimePicker";

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
  
  // Función para obtener el icono según el tipo de vehículo
  const getVehicleIcon = (vehicleTypeName: string, size: "sm" | "lg" = "sm") => {
    const name = vehicleTypeName.toLowerCase();
    const iconSize = size === "lg" ? "h-8 w-8" : "h-4 w-4";
    
    switch (name) {
      case 'car':
        return <Car className={`${iconSize} text-blue-500`} />;
      case 'motorcycle':
        return <Bike className={`${iconSize} text-green-500`} />;
      case 'suv':
        return <Truck className={`${iconSize} text-orange-500`} />;
      case 'bus':
        return <Bus className={`${iconSize} text-purple-500`} />;
      default:
        return <Car className={`${iconSize} text-gray-500`} />; // Icono por defecto
    }
  };

  // Función para obtener el color del borde según el tipo de vehículo
  const getVehicleColor = (vehicleTypeName: string) => {
    const name = vehicleTypeName.toLowerCase();
    switch (name) {
      case 'car':
        return 'border-blue-200 bg-blue-50 hover:border-blue-300';
      case 'motorcycle':
        return 'border-green-200 bg-green-50 hover:border-green-300';
      case 'suv':
        return 'border-orange-200 bg-orange-50 hover:border-orange-300';
      case 'bus':
        return 'border-purple-200 bg-purple-50 hover:border-purple-300';
      default:
        return 'border-gray-200 bg-gray-50 hover:border-gray-300';
    }
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
          <Label htmlFor="vehicleType" className="text-base font-medium mb-4 block">
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
                    relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                    w-32 min-w-[120px] flex-shrink-0
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                      : `${getVehicleColor(type.name)} hover:shadow-sm`
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {getVehicleIcon(type.name, "lg")}
                    <span className={`text-sm font-medium text-center ${
                      isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {t(type.name)}
                    </span>
                  </div>
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
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
          onTimeChange={(value) => handleSelectChange("entryTime", value)}
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
            className="flex items-center gap-2 bg-yellow-50 border-yellow-400 text-yellow-800"
          >
            <Info className="w-5 h-5 text-yellow-600" />
            <span>{t("recheckAvailabilityRequired")}</span>
          </Alert>
        )}
        {/* Mensaje de disponibilidad o no disponibilidad */}
        {availability === true && (
          <Alert
            variant="default"
            className="flex items-center gap-2 bg-green-50 border-green-400 text-green-800"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>{t("slotAvailable")}</span>
          </Alert>
        )}
        {availability === false && (
          <Alert
            variant="destructive"
            className="flex items-center gap-2 bg-red-50 border-red-400 text-red-800"
          >
            <XCircle className="w-5 h-5 text-red-600" />
            <span>{t("slotUnavailable")}</span>
          </Alert>
        )}
      </div>
      {availability === false && slotDetails.length > 0 && (
        <div className="bg-white border border-red-200 p-4 rounded-md mt-4">
          <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" /> {t("unavailableSlots")}
          </h3>
          {/* Lista de slots no disponibles agrupados */}
          <UnavailableSlotsList slotDetails={slotDetails} t={t} />
        </div>
      )}
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
