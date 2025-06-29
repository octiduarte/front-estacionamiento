import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import TimeSelector from '@/components/ui/time-selector';
import { format, isToday } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { cn } from "@/lib/utils";
import React from "react";

interface DateTimePickerProps {
  t: (key: string) => string;
  dateLabel: string;
  timeLabel: string;
  dateValue: Date | undefined;
  timeValue: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (value: string) => void;
  disabled?: boolean;
  fromDate?: Date;
  minTime?: string;
  excludeMinTime?: boolean; // Para fecha de salida: excluir la hora exacta de minTime
  placeholder?: {
    date: string;
    time: string;
  };
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  t,
  dateLabel,
  timeLabel,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabled = false,
  fromDate,
  minTime,
  excludeMinTime = false, // Por defecto no excluye la hora mínima (para fecha de entrada)
  placeholder,
}) => {
  // Constante para la zona horaria de Italia
  const ITALY_TIMEZONE = 'Europe/Rome';
  
  // Obtener la fecha y hora actual en Italia
  const nowInItaly = toZonedTime(new Date(), ITALY_TIMEZONE);
  const todayInItaly = new Date(nowInItaly.getFullYear(), nowInItaly.getMonth(), nowInItaly.getDate());

  // Nueva lógica: si en Italia son las 23:00 o más, forzar fecha mínima al día siguiente
  const isLateInItaly = nowInItaly.getHours() >= 23;
  const minSelectableDate = isLateInItaly
    ? new Date(nowInItaly.getFullYear(), nowInItaly.getMonth(), nowInItaly.getDate() + 1)
    : (fromDate || todayInItaly);

  // Calcular la hora mínima basada en si la fecha seleccionada es hoy en Italia o el día siguiente después de las 23:00
  const getEffectiveMinTime = (): string | undefined => {
    // Si ya hay un minTime pasado como prop, usarlo (para fecha de salida)
    if (minTime) {
      return minTime;
    }
    // Si es tarde en Italia y la fecha seleccionada es el día siguiente, la hora mínima es 00:00
    if (isLateInItaly && dateValue && dateValue.getTime() === minSelectableDate.getTime()) {
      return "00:00";
    }
    // Si la fecha seleccionada es hoy en Italia, usar la hora actual de Italia como mínimo
    if (!isLateInItaly && dateValue && dateValue.getTime() === todayInItaly.getTime()) {
      // Si hay minutos, redondear hacia arriba a la próxima hora
      const currentHour = nowInItaly.getHours();
      const currentMinutes = nowInItaly.getMinutes();
      const minHour = currentMinutes > 0 ? currentHour + 1 : currentHour;
      return `${minHour.toString().padStart(2, "0")}:00`;
    }
    // En otros casos, no hay restricción de hora mínima
    return undefined;
  };

  // Si la fecha seleccionada es el día siguiente por la restricción de las 23:00, forzar la hora seleccionada a 00:00 si está vacía o es menor
  React.useEffect(() => {
    if (
      isLateInItaly &&
      dateValue &&
      dateValue.getTime() === minSelectableDate.getTime() &&
      (timeValue === "" || (parseInt(timeValue.split(":")[0], 10) < 0))
    ) {
      onTimeChange("00:00");
    }
  }, [isLateInItaly, dateValue, minSelectableDate, timeValue, onTimeChange]);

  const effectiveMinTime = getEffectiveMinTime();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={dateLabel.toLowerCase()}>{dateLabel}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateValue && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              {dateValue ? format(dateValue, "dd/MM/yyyy") : placeholder?.date || t("selectDate")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <ShadcnCalendar
              mode="single"
              selected={dateValue}
              onSelect={onDateChange}
              initialFocus
              fromDate={minSelectableDate}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor={timeLabel.toLowerCase()}>{timeLabel}</Label>
        <TimeSelector
          value={timeValue}
          onValueChange={onTimeChange}
          disabled={disabled}
          minTime={effectiveMinTime}
          excludeMinTime={excludeMinTime}
          placeholder={placeholder?.time || t("selectTime")}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
