import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { isBefore } from "date-fns";
import { getCurrentItalyTime, getTodayInItaly } from "@/lib/italy-time";
import { ChevronDown } from "lucide-react";

// Generar horas válidas (solo terminadas en :00)
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hours.push(hour);
  }
  return hours;
};

const AVAILABLE_HOURS = generateHours();

// Función simplificada para obtener horas disponibles según el contexto
const getAvailableHours = (
  selectedDate: Date | undefined,
  isExitPicker: boolean = false,
  entryDate?: Date,
  entryTime?: string
) => {
  if (!selectedDate) return AVAILABLE_HOURS;

  // Para picker de salida
  if (isExitPicker && entryDate && entryTime) {
    // Si es la misma fecha, filtrar horas menores o iguales a la hora de entrada
    if (entryDate.toDateString() === selectedDate.toDateString()) {
      const entryHour = Number.parseInt(entryTime.split(":")[0]);
      return AVAILABLE_HOURS.filter((hour) => {
        const hourNumber = Number.parseInt(hour.split(":")[0]);
        return hourNumber > entryHour;
      });
    }
    // Si es una fecha posterior, todas las horas están disponibles
    return AVAILABLE_HOURS;
  }

  // Para picker de entrada
  const nowInItaly = getCurrentItalyTime();
  const todayInItaly = getTodayInItaly();

  // Si la fecha seleccionada es hoy en Italia
  if (selectedDate.getTime() === todayInItaly.getTime()) {
    const currentHour = nowInItaly.getHours();
    const minHour = currentHour + 1; // Simplificado: siempre próxima hora

    return AVAILABLE_HOURS.filter((hour) => {
      const hourNumber = Number.parseInt(hour.split(":")[0]);
      return hourNumber >= minHour;
    });
  }

  // Para fechas futuras, todas las horas están disponibles
  return AVAILABLE_HOURS;
};

interface SimpleDateTimePickerProps {
  t: (key: string) => string;
  dateLabel: string;
  timeLabel: string;
  dateValue: Date | undefined;
  timeValue: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (value: string) => void;
  disabled?: boolean;
  minSelectableDate?: Date;
  isExitPicker?: boolean;
  entryDate?: Date;
  entryTime?: string;
}

const SimpleDateTimePicker: React.FC<SimpleDateTimePickerProps> = ({
  t,
  dateLabel,
  timeLabel,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabled = false,
  minSelectableDate,
  isExitPicker = false,
  entryDate,
  entryTime = "",
}) => {
  // Obtener horas disponibles según el tipo de picker
  const availableHours = getAvailableHours(
    dateValue,
    isExitPicker,
    entryDate,
    entryTime
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-base font-medium">{dateLabel}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-10 justify-between text-left font-normal border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {dateValue ? format(dateValue, "dd/MM/yy") : t("selectDate")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border border-border">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={onDateChange}
              disabled={(date) => {
                if (minSelectableDate) {
                  if (isExitPicker && entryDate) {
                    return isBefore(date, entryDate);
                  }
                  return isBefore(date, minSelectableDate);
                }
                return false;
              }}
              initialFocus
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">{timeLabel}</Label>
        <Select
          value={timeValue}
          onValueChange={onTimeChange}
          disabled={disabled}
        >
          <SelectTrigger className="border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground">
            <ClockIcon className=" mr-2 h-4 w-4 text-primary" />
            <SelectValue placeholder={t("selectTime")} />
          </SelectTrigger>
          <SelectContent className="bg-popover text-primary border border-border">
            {availableHours.map((hour: string) => (
              <SelectItem
                key={hour}
                value={hour}
                className="text-foreground hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary data-[state=checked]:text-white"
              >
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SimpleDateTimePicker;
