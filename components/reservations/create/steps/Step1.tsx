import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import TimeSelector from '@/components/ui/time-selector';
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import UnavailableSlotsList from "../UnavailableSlotsList";

interface Step1Props {
  t: (key: string) => string;
  formData: any;
  entryDateObj: Date | undefined;
  exitDateObj: Date | undefined;
  vehicleTypes: { id: number; name: string }[];
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (name: 'entryDate' | 'exitDate', date: Date | undefined) => void;
  checkAvailability: () => Promise<void>;
  checking: boolean;
  availability: boolean | null;
  slotDetails: { start_time: string; end_time: string; is_available: boolean; available_spaces: number }[];
  error: string;
  nextStep: () => void;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label  htmlFor="entryDate">{t("entryDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !entryDateObj && "text-muted-foreground"
                  )}
                >
                  {entryDateObj ? format(entryDateObj, "dd/MM/yyyy") : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={entryDateObj}
                  onSelect={(date) => handleDateChange('entryDate', date)}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>          <div>
            <Label htmlFor="entryTime">{t("entryTime")}</Label>
            <TimeSelector
              value={formData.entryTime}
              onValueChange={(value) => handleSelectChange("entryTime", value)}
              placeholder={t("selectTime")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="exitDate">{t("exitDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !exitDateObj && "text-muted-foreground"
                  )}
                  disabled={!(formData.entryDate && formData.entryTime)}
                >
                  {exitDateObj ? format(exitDateObj, "dd/MM/yyyy") : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={exitDateObj}
                  onSelect={(date) => handleDateChange('exitDate', date)}
                  initialFocus
                  fromDate={entryDateObj || new Date()}
                  disabled={!formData.entryDate || !formData.entryTime}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="exitTime">{t("exitTime")}</Label>            <TimeSelector
              value={formData.exitTime}
              onValueChange={(value) => handleSelectChange("exitTime", value)}
              disabled={!(formData.entryDate && formData.entryTime)}
              minTime={formData.entryDate === formData.exitDate ? formData.entryTime : undefined}
              placeholder={t("selectTime")}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {/* Error si la fecha salida es mayor a la fecha de entrada (No realiza fetch)*/}
        {error && (
          <Alert variant="destructive" className="flex items-center gap-2 bg-red-200 border-red-400 text-red-8">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </Alert>
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
          <Alert variant="default" className="flex items-center gap-2 bg-green-50 border-green-400 text-green-800">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>{t("slotAvailable")}</span>
          </Alert>
        )}
        {availability === false && (
          <Alert variant="destructive" className="flex items-center gap-2 bg-red-50 border-red-400 text-red-800">
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
