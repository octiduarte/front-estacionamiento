"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { getVehicleTypes } from "@/lib/reservations/create/getVehicleTypes";
import { getAvailability } from "@/lib/reservations/create/getAvailability";
import { getTotalPrice } from "@/lib/reservations/create/getTotalPrice";
import { createAdminReservation } from "@/lib/admin/dashboard/reservations/createAdminReservtaions";
import SimpleDateTimePicker from "@/components/reservations/create/form/SimpleDateTimePicker";
import UnavailableSlotsList from "@/components/reservations/create/UnavailableSlotsList";
import {
  getMinSelectableDateInItaly,
  createItalyDateTime,
  convertItalyToUTC,
} from "@/lib/italy-time";
import {
  getVehicleTypeId,
  getVehicleTypeItalian,
} from "@/hooks/reservations/create/constants";
import { isAfter } from "date-fns";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import Wheel from "@/components/ui/wheel";
import { useLocale } from "next-intl";

interface CreateReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationCreated: () => void;
}

interface FormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  vehicle_type_id: number | undefined;
  vehicle_plate: string;
  vehicle_model: string;
  entryDate: Date | undefined;
  entryTime: string;
  exitDate: Date | undefined;
  exitTime: string;
}

export function CreateReservationModal({
  open,
  onOpenChange,
  onReservationCreated,
}: CreateReservationModalProps) {
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    user_email: "",
    user_phone: "",
    vehicle_type_id: undefined,
    vehicle_plate: "",
    vehicle_model: "",
    entryDate: undefined,
    entryTime: "",
    exitDate: undefined,
    exitTime: "",
  });

  const [availability, setAvailability] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  // Get minimum selectable date in Italy timezone
  const minSelectableDate = getMinSelectableDateInItaly();
  const vehicleTypeId = formData.vehicle_type_id;

  // Get vehicle types
  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Get token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  // Transforma la fecha e ora di entrata e uscita in stringhe UTC

  const start_time =
    formData.entryDate && formData.entryTime
      ? convertItalyToUTC(formData.entryDate, formData.entryTime)
      : "";
  console.log("Start time:", start_time);
  const end_time =
    formData.exitDate && formData.exitTime
      ? convertItalyToUTC(formData.exitDate, formData.exitTime)
      : "";
  console.log("End time:", end_time);

  // Get total price - only when we have all required data and availability is confirmed

  const { data: totalPrice = 0 } = useQuery({
    queryKey: ["totalPrice", vehicleTypeId, start_time, end_time],
    queryFn: () =>
      getTotalPrice({
        vehicleTypeId: vehicleTypeId ?? 0,
        startTime: start_time,
        endTime: end_time,
      }),
    enabled: !!(availability && vehicleTypeId && start_time && end_time),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Availability check mutation
  const availabilityMutation = useMutation({
    mutationFn: async () => {
      return getAvailability({
        startTime: start_time,
        endTime: end_time,
        vehicleTypeId: vehicleTypeId ?? 0,
      });
    },
    onSuccess: (data) => {
      setAvailability(data.is_overall_available);
      setAvailabilityChecked(true);
      setSlotDetails(data.slot_details || []);
      if (data.is_overall_available) {
        toast.success("Disponibilità confermata!");
      } else {
        toast.error("Slot non disponibile per le date selezionate");
      }
    },
    onError: (error) => {
      toast.error(`Errore nel verificare disponibilità: ${error.message}`);
    },
  });

  // Create reservation mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return createAdminReservation(token, data);
    },
    onSuccess: () => {
      toast.success("Prenotazione creata con successo!");
      onReservationCreated();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Errore nella creazione: ${error.message}`);
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      user_name: "",
      user_email: "",
      user_phone: "",
      vehicle_type_id: undefined,
      vehicle_plate: "",
      vehicle_model: "",
      entryDate: undefined,
      entryTime: "",
      exitDate: undefined,
      exitTime: "",
    });
    setAvailability(null);
    setAvailabilityChecked(false);
    setSlotDetails([]);
  };

  // Check if dates are valid
  const isDateTimeValid = (): boolean => {
    if (
      !formData.entryDate ||
      !formData.entryTime ||
      !formData.exitDate ||
      !formData.exitTime
    ) {
      return false;
    }

    const entryDateTime = createItalyDateTime(
      formData.entryDate,
      formData.entryTime
    );
    const exitDateTime = createItalyDateTime(
      formData.exitDate,
      formData.exitTime
    );

    return isAfter(exitDateTime, entryDateTime);
  };

  // Check availability handler
  const handleCheckAvailability = () => {
    if (!isDateTimeValid() || !formData.vehicle_type_id) {
      toast.error("Seleziona date valide e tipo di veicolo");
      return;
    }

    setAvailabilityChecked(false);
    setAvailability(null);
    availabilityMutation.mutate();
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!availability) {
      toast.error("Verifica prima la disponibilità");
      return;
    }
    if (!formData.vehicle_type_id) {
      toast.error("Tipo di veicolo non valido");
      return;
    }

    const reservationData = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      user_phone: formData.user_phone,
      vehicle_type_id: formData.vehicle_type_id,
      vehicle_plate: formData.vehicle_plate,
      vehicle_model: formData.vehicle_model,
      payment_method_id: 1, // Default to cash/onsite payment
      start_time: start_time,
      end_time: end_time,
      total_price: totalPrice,
      language: locale,
    };

    createMutation.mutate(reservationData);
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset availability when dates or vehicle type change
    if (
      [
        "entryDate",
        "entryTime",
        "exitDate",
        "exitTime",
        "vehicle_type_id",
      ].includes(field)
    ) {
      setAvailability(null);
      setAvailabilityChecked(false);
      setSlotDetails([]);
    }
  };

  const canCheckAvailability =
    formData.entryDate &&
    formData.entryTime &&
    formData.exitDate &&
    formData.exitTime &&
    formData.vehicle_type_id &&
    isDateTimeValid();

  const canCreateReservation =
    availability &&
    formData.user_name &&
    formData.user_email &&
    formData.user_phone &&
    formData.vehicle_plate &&
    formData.vehicle_model;



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crea Nuova Prenotazione</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date e Orari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Tipo di Veicolo</Label>
                <Select
                  value={formData.vehicle_type_id?.toString() ?? ""}
                  onValueChange={(value) =>
                    handleInputChange("vehicle_type_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo veicolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type: { id: number; name: string }) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {getVehicleTypeItalian(type.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Entry Date and Time */}
              <SimpleDateTimePicker
                t={(key: string) => {
                  const translations: Record<string, string> = {
                    selectDate: "Seleziona data",
                    selectTime: "Seleziona ora",
                    selectDateFirst: "Seleziona prima la data",
                  };
                  return translations[key] || key;
                }}
                dateLabel="Data di Inizio"
                timeLabel="Ora di Inizio"
                dateValue={formData.entryDate}
                timeValue={formData.entryTime}
                onDateChange={(date) => handleInputChange("entryDate", date)}
                onTimeChange={(time) => handleInputChange("entryTime", time)}
                minSelectableDate={minSelectableDate}
              />

              {/* Exit Date and Time */}
              <SimpleDateTimePicker
                t={(key: string) => {
                  const translations: Record<string, string> = {
                    selectDate: "Seleziona data",
                    selectTime: "Seleziona ora",
                    selectDateFirst: "Seleziona prima la data",
                  };
                  return translations[key] || key;
                }}
                dateLabel="Data di Fine"
                timeLabel="Ora di Fine"
                dateValue={formData.exitDate}
                timeValue={formData.exitTime}
                onDateChange={(date) => handleInputChange("exitDate", date)}
                onTimeChange={(time) => handleInputChange("exitTime", time)}
                minSelectableDate={minSelectableDate}
              />

              {/* Availability Check Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={
                    !canCheckAvailability || availabilityMutation.isPending
                  }
                  variant={availability === true ? "default" : "secondary"}
                  className="w-full max-w-sm"
                >
                  {availabilityMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Controllo disponibilità...
                    </>
                  ) : availability === true ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Disponibile
                    </>
                  ) : (
                    "Controlla Disponibilità"
                  )}
                </Button>
              </div>

              {/* Total Amount - Only show if available */}
              {availability === true && (
                <div className="text-center">
                  <span className="text-sm font-semibold text-primary">
                    Prezzo stimato: €{totalPrice}
                  </span>
                </div>
              )}

              {/* Unavailable Slots List */}
              {availability === false && slotDetails.length > 0 && (
                <UnavailableSlotsList
                  slotDetails={slotDetails}
                  t={(key: string) => {
                    const translations: Record<string, string> = {
                      unavailable: "Non disponibile",
                    };
                    return translations[key] || key;
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Customer Information - Only show if availability is confirmed */}
          {availability && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informazioni Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user_name">Nome Completo</Label>
                      <Input
                        id="user_name"
                        required
                        value={formData.user_name}
                        onChange={(e) =>
                          handleInputChange("user_name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_email">Email</Label>
                      <Input
                        id="user_email"
                        type="email"
                        required
                        value={formData.user_email}
                        onChange={(e) =>
                          handleInputChange("user_email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="user_phone">Numero di Telefono</Label>
                    <Input
                      id="user_phone"
                      required
                      value={formData.user_phone}
                      onChange={(e) =>
                        handleInputChange("user_phone", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informazioni Veicolo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicle_plate">Targa</Label>
                      <Input
                        id="vehicle_plate"
                        required
                        value={formData.vehicle_plate}
                        onChange={(e) =>
                          handleInputChange("vehicle_plate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle_model">Modello Veicolo</Label>
                      <Input
                        id="vehicle_model"
                        required
                        value={formData.vehicle_model}
                        onChange={(e) =>
                          handleInputChange("vehicle_model", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={!canCreateReservation || createMutation.isPending}
                  className="min-w-[140px]"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creazione...
                    </>
                  ) : (
                    "Crea Prenotazione"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
