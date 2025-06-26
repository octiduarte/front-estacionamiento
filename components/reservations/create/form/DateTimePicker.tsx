import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import TimeSelector from '@/components/ui/time-selector';
import { format, isToday } from "date-fns";
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
  placeholder,
}) => {
  // Calcular la hora mínima basada en si la fecha seleccionada es hoy
  const getEffectiveMinTime = (): string | undefined => {
    // Si ya hay un minTime pasado como prop, usarlo (para fecha de salida)
    if (minTime) {
      return minTime;
    }
    
    // Si la fecha seleccionada es hoy, usar la hora actual como mínimo
    if (dateValue && isToday(dateValue)) {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, "0");
      return `${currentHour}:00`;
    }
    
    // En otros casos, no hay restricción de hora mínima
    return undefined;
  };

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
              fromDate={fromDate || new Date()}
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
          placeholder={placeholder?.time || t("selectTime")}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
