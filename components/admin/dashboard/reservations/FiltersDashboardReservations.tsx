import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";

interface FiltersDashboardReservationsProps {
  filters: {
    startDate: string;
    endDate: string;
    vehicleType: string;
    status: string;
    code: string;
  };
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startCalendarOpen: boolean;
  setStartCalendarOpen: (open: boolean) => void;
  endCalendarOpen: boolean;
  setEndCalendarOpen: (open: boolean) => void;
  showFilters: boolean;
  setShowFilters: (open: boolean) => void;
  vehicleTypes: any[];
  loadingVehicleTypes: boolean;
  handleFilterChange: (key: string, value: string) => void;
  handleDateChange: (
    key: "startDate" | "endDate",
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    setCalendarOpen: (open: boolean) => void
  ) => void;
  clearAllFilters: () => void;
}

export function FiltersDashboardReservations({
  filters,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startCalendarOpen,
  setStartCalendarOpen,
  endCalendarOpen,
  setEndCalendarOpen,
  showFilters,
  setShowFilters,
  vehicleTypes,
  loadingVehicleTypes,
  handleFilterChange,
  handleDateChange,
  clearAllFilters,
}: FiltersDashboardReservationsProps) {
  // Estado local para el input de código
  const [localCode, setLocalCode] = useState(filters.code);

  useEffect(() => {
    setLocalCode(filters.code);
  }, [filters.code]);

  //Espera 800ms antes de aplicar el filtro de código
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localCode !== filters.code) {
        handleFilterChange("code", localCode);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [localCode]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtri</CardTitle>
          {/* Botón toggle solo visible en mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Nascondi" : "Mostra"} Filtri
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inizio</Label>
              <Popover
                open={startCalendarOpen}
                onOpenChange={setStartCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !startDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) =>
                      handleDateChange(
                        "startDate",
                        date,
                        setStartDate,
                        setStartCalendarOpen
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="endDate">Data Fine</Label>
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !endDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) =>
                      handleDateChange(
                        "endDate",
                        date,
                        setEndDate,
                        setEndCalendarOpen
                      )
                    }
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="vehicleType">Tipo Veicolo</Label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) =>
                  handleFilterChange("vehicleType", value)
                }
                disabled={loadingVehicleTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  {vehicleTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Stato</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tutti gli stati" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="active">Attiva</SelectItem>
                  <SelectItem value="pending">In attesa</SelectItem>
                  <SelectItem value="canceled">Annullata</SelectItem>
                  <SelectItem value="finished">Completata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="code">Codice Prenotazione</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="Cerca codice..."
                  className="pl-8"
                  value={localCode}
                  onChange={(e) => setLocalCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancella
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
