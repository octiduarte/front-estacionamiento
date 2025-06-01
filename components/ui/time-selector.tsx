"use client"

import React, { useState } from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  minTime?: string; // Optional: for future use
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onValueChange, disabled = false, minTime }) => {
  const [selectedTime, setSelectedTime] = useState<string>(value);

  // Generar array de 24 horas (00:00 a 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Si hay minTime, filtrar las horas mayores estrictamente (no igual)
  const filteredHours = minTime
    ? hours.filter((time) => time > minTime)
    : hours;

  const handleChange = (newValue: string) => {
    setSelectedTime(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      <Select value={selectedTime} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder="Selecciona una hora" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filteredHours.map((time) => (
            <SelectItem key={time} value={time} disabled={disabled}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
