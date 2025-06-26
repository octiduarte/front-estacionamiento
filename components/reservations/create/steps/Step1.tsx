import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info } from "lucide-react";
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
          <Label htmlFor="vehicleType">{t("vehicleType")}</Label>
          <Select
            name="vehicleType"
            value={formData.vehicleType}
            onValueChange={(value) => handleSelectChange("vehicleType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectVehicleType")} />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {t(type.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          placeholder={{
            date: t("selectDate"),
            time: t("selectTime"),
          }}
        />
      </div>{" "}
      <div className="flex flex-col gap-2">
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
