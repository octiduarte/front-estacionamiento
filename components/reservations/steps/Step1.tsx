import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import TimeSelector from '@/components/ui/time-selector';
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import { Alert } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface Step1Props {
  t: (key: string) => string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  entryDateObj: Date | undefined;
  setEntryDateObj: (date: Date | undefined) => void;
  exitDateObj: Date | undefined;
  setExitDateObj: (date: Date | undefined) => void;
  vehicleTypes: { id: number; name: string }[];
  handleSelectChange: (name: string, value: string) => void;
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
  setFormData,
  entryDateObj,
  setEntryDateObj,
  exitDateObj,
  setExitDateObj,
  vehicleTypes,
  handleSelectChange,
  checkAvailability,
  checking,
  availability,
  slotDetails,
  error,
  nextStep,
}) => {
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
            <Label htmlFor="entryDate">{t("entryDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !entryDateObj && "text-muted-foreground"
                  )}
                >
                  {entryDateObj ? format(entryDateObj, "PPP") : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={entryDateObj}
                  onSelect={setEntryDateObj}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="entryTime">{t("entryTime")}</Label>
            <TimeSelector
              value={formData.entryTime}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, entryTime: value }))}
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
                  {exitDateObj ? format(exitDateObj, "PPP") : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={exitDateObj}
                  onSelect={setExitDateObj}
                  initialFocus
                  fromDate={entryDateObj || new Date()}
                  disabled={!formData.entryDate || !formData.entryTime}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="exitTime">{t("exitTime")}</Label>
            <TimeSelector
              value={formData.exitTime}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, exitTime: value }))}
              disabled={!(formData.entryDate && formData.entryTime)}
              minTime={formData.entryDate === formData.exitDate ? formData.entryTime : undefined}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
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
        {/* Mensaje de disponibilidad */}
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
        {error && (
          <Alert variant="destructive" className="flex items-center gap-2 bg-red-50 border-red-400 text-red-800">
            <Info className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </Alert>
        )}
      </div>
      {/* Slots alternativos visualmente destacados */}
      {availability === false && slotDetails.length > 0 && (
        <div className="bg-white border border-red-200 p-4 rounded-md mt-4">
          <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" /> {t("unavailableSlots")}
          </h3>
          {/* Agrupar solo los slots no disponibles consecutivos */}
          {(() => {
            function groupConsecutiveUnavailable(slots: { start_time: string; end_time: string; is_available: boolean }[]) {
              const unavailable = slots.filter((s) => !s.is_available);
              if (!unavailable.length) return [];
              const groups = [];
              let current = {
                start_time: unavailable[0].start_time,
                end_time: unavailable[0].end_time,
              };
              for (let i = 1; i < unavailable.length; i++) {
                const slot = unavailable[i];
                if (new Date(slot.start_time).getTime() === new Date(current.end_time).getTime()) {
                  current.end_time = slot.end_time;
                } else {
                  groups.push({ ...current });
                  current = {
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                  };
                }
              }
              groups.push({ ...current });
              return groups;
            }
            const unavailableGroups = groupConsecutiveUnavailable(slotDetails);
            return (
              <ul className="space-y-2 mt-1">
                {unavailableGroups.map((group, index) => (
                  <li
                    key={"unavailable-" + index}
                    className="flex justify-between items-center px-2 py-1 rounded-md bg-red-50 text-red-700"
                  >
                    <span className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      {format(new Date(group.start_time), "PPPpp")} - {format(new Date(group.end_time), "PPPpp")}
                    </span>
                    <span className="font-medium">{t("unavailable")}</span>
                  </li>
                ))}
              </ul>
            );
          })()}
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
