"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { createAdminReservation } from "@/lib/admin/dashboard/reservations/createAdminReservations";
import SimpleDateTimePicker from "@/components/reservations/create/form/SimpleDateTimePicker";
import { Separator } from "@/components/ui/separator";
import UnavailableSlotsList from "@/components/reservations/create/UnavailableSlotsList";
import { getVehicleTypeItalian } from "@/hooks/reservations/create/constants";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import countryData from "country-telephone-data";
import { useCreateDashboardReservation } from "@/hooks/admin/dashboard/reservations/modal/useCreateDashboardReservation";
import { ClientInfoForm } from "./ClientInfoForm";
import { useState, useRef, useEffect } from "react";

const countryOptions = (
  countryData.allCountries as Array<{
    name: string;
    dialCode: string;
    iso2: string;
  }>
).map((country) => ({
  name: country.name,
  dialCode: country.dialCode,
  iso2: country.iso2,
}));

interface CreateReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationCreated: () => void;
}

export function CreateReservationModal({
  open,
  onOpenChange,
  onReservationCreated,
}: CreateReservationModalProps) {
  // Estado para mostrar el panel de confirmación inline
  const [showConfirm, setShowConfirm] = useState(false);
  // Referencias para scroll automático
  const confirmPanelRef = useRef<HTMLDivElement>(null);
  const unavailableSlotsRef = useRef<HTMLDivElement>(null);
  const clientInfoRef = useRef<HTMLDivElement>(null);
  // Usar el hook personalizado
  const {
    formData,
    availability,
    setAvailability,
    setAvailabilityChecked,
    slotDetails,
    setSlotDetails,
    selectedCountry,
    setSelectedCountry,
    minSelectableDate,
    start_time,
    end_time,
    token,
    resetForm,
    createHandleCheckAvailability,
    createHandleSubmit,
    handleInputChange,
    isEmailValid,
    isNameValid,
    isPhoneValid,
    touched,
    handleBlur,
    canCheckAvailability,
  } = useCreateDashboardReservation();

  // Contador de 5 minutos (300 segundos)
  const [timer, setTimer] = useState<number>(0);

  // Get vehicle types
  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Get vehicle type id
  const vehicleTypeId = formData.vehicle_type_id;

  // Obtenemos el precio total. se ejecuta solo si hay disponibilidad
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
    onError: (error: any) => {
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

  // Create handlers using the hook functions
  const handleCheckAvailability = createHandleCheckAvailability(() => {
    availabilityMutation.mutate();
  });

  const handleSubmit = createHandleSubmit((data) => {
    createMutation.mutate(data);
  }, totalPrice);

  // Can create reservation validation
  const canCreateReservation =
    availability &&
    formData.user_name &&
    isNameValid(formData.user_name) &&
    formData.user_email &&
    isEmailValid(formData.user_email) &&
    formData.user_phone &&
    isPhoneValid(formData.user_phone) &&
    formData.vehicle_plate &&
    formData.vehicle_model;

  // Handler para cerrar el modal y limpiar el formulario
  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
      setShowConfirm(false);
    }
    onOpenChange(open);
  };

  // Scroll automático cuando la disponibilidad es exitosa (lleva a Informazioni Cliente)
  useEffect(() => {
    if (availability === true) {
      setTimeout(() => {
        clientInfoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [availability]);

  // Scroll automático cuando no hay disponibilidad y hay slots
  useEffect(() => {
    if (
      availability === false &&
      slotDetails.length > 0 &&
      unavailableSlotsRef.current
    ) {
      setTimeout(() => {
        unavailableSlotsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [availability, slotDetails]);

  // Scroll automático cuando se muestra el panel de confirmación
  useEffect(() => {
    if (showConfirm && confirmPanelRef.current) {
      setTimeout(() => {
        confirmPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [showConfirm]);

  // Inicia el contador cuando availability es true
  useEffect(() => {
    if (availability === true) {
      setTimer(300);
    } else {
      setTimer(0);
    }
  }, [availability]);

  // Disminuye el contador cada segundo y hay que checkear disponibilidad de nuevo.
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setAvailability(null);
          setAvailabilityChecked(false);
          setShowConfirm(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* Se añade clase para scroll automático debido a que el calendario con el overflow-y-auto se rompe */}
      <DialogContent
        className={`sm:max-w-xl max-h-[90vh]${
          availability === true ||
          (availability === false && slotDetails.length > 0)
            ? " overflow-y-auto"
            : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle>Crea Nuova Prenotazione</DialogTitle>
          <DialogDescription>
            Compila i dati per creare una nuova prenotazione.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <Card className="p-2 md:p-4">
            <CardHeader className="p-2 md:p-4">
              <CardTitle className="text-base md:text-lg">
                Date e Orari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-2 md:p-4">
              {/* Seleccion de tipo de vehiculo */}
              <div className="space-y-1 md:space-y-2">
                <Label
                  htmlFor="vehicle_type_id"
                  className="text-sm md:text-base"
                >
                  Tipo di Veicolo
                </Label>
                <Select
                  name="vehicle_type_id"
                  value={formData.vehicle_type_id?.toString() ?? ""}
                  onValueChange={(value) => {
                    handleInputChange("vehicle_type_id", value);
                  }}
                >
                  <SelectTrigger
                    id="vehicle_type_id"
                    className="h-8 md:h-10 text-sm md:text-base "
                  >
                    <SelectValue placeholder="Seleziona tipo veicolo" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-primary border border-border text-sm md:text-base max-h-60">
                    {vehicleTypes.map((type: { id: number; name: string }) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        className="text-foreground hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary data-[state=checked]:text-white text-center justify-center md:py-1.5 text-xs md:text-sm px-4 leading-tight"
                      >
                        {getVehicleTypeItalian(type.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Fecha y hora de entrada */}
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
                dateInputId="entryDate"
                timeInputId="entryTime"
                dateValue={formData.entryDate}
                timeValue={formData.entryTime}
                onDateChange={(date) => handleInputChange("entryDate", date)}
                onTimeChange={(time) => handleInputChange("entryTime", time)}
                minSelectableDate={minSelectableDate}
              />

              <Separator />

              {/* Selector de Fecha y hora de salida */}
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
                dateInputId="exitDate"
                timeInputId="exitTime"
                dateValue={formData.exitDate}
                timeValue={formData.exitTime}
                onDateChange={(date) => handleInputChange("exitDate", date)}
                onTimeChange={(time) => handleInputChange("exitTime", time)}
                minSelectableDate={formData.entryDate || minSelectableDate}
              />

              {/* Boton de checkeo de disponibilidad */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={
                    !canCheckAvailability || availabilityMutation.isPending
                  }
                  variant={availability === true ? "default" : "secondary"}
                  className="w-full max-w-xs"
                  size="mobile"
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

              {/* Precio total */}
              {availability === true && totalPrice > 0 && (
                <div className="text-center">
                  <span className="text-sm font-semibold text-primary">
                    Prezzo stimato: €{totalPrice}
                  </span>
                </div>
              )}

              {/* Unavailable Slots List */}
              {availability === false && slotDetails.length > 0 && (
                <div ref={unavailableSlotsRef}>
                  <UnavailableSlotsList
                    slotDetails={slotDetails}
                    t={(key: string) => {
                      const translations: Record<string, string> = {
                        unavailable: "Non disponibile",
                      };
                      return translations[key] || key;
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solo se muestra si la disponibilidad dio true y el precio es mayor a 0 */}
          {availability && totalPrice > 0 && (
            <>
              {/* Contador visible solo si availability === true */}
              {availability === true && timer > 0 && (
                <div className="w-full flex justify-center mb-2">
                  <span className="text-sm font-semibold text-red-600">
                    Tempo rimanente:{" "}
                    {`${Math.floor(timer / 60)
                      .toString()
                      .padStart(2, "0")}:${(timer % 60)
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                </div>
              )}
              <Card className="p-2 md:p-4" ref={clientInfoRef}>
                <CardHeader className="p-2 md:p-4">
                  <CardTitle className="text-base md:text-lg">
                    Informazioni Cliente e Veicolo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-4 p-2 md:p-4">
                  <ClientInfoForm
                    user_name={formData.user_name}
                    user_email={formData.user_email}
                    user_phone={formData.user_phone}
                    vehicle_plate={formData.vehicle_plate}
                    vehicle_model={formData.vehicle_model}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countryOptions={countryOptions}
                    isNameValid={isNameValid}
                    isEmailValid={isEmailValid}
                    isPhoneValid={isPhoneValid}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    touched={touched}
                  />
                </CardContent>
              </Card>

              {/* Submit boton */}
              <div className="flex flex-col items-end space-y-2 md:space-y-4">
                {/* Botones principales */}
                {!showConfirm && (
                  <div className="flex space-x-2 md:space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleClose(false)}
                      size="mobile"
                    >
                      Annulla
                    </Button>
                    <Button
                      type="button"
                      disabled={
                        !canCreateReservation || createMutation.isPending
                      }
                      size="mobile"
                      onClick={() => setShowConfirm(true)}
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
                )}
                {/* Panel de confirmación inline */}
                {showConfirm && (
                  <div
                    ref={confirmPanelRef}
                    className="w-full bg-muted border rounded-md p-4 flex flex-col space-y-4"
                  >
                    <div className="mb-2 text-left">
                      <div className="font-semibold mb-1">
                        Conferma Prenotazione
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Sei sicuro di voler creare questa prenotazione?
                      </div>
                    </div>
                    <div className="flex w-full justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowConfirm(false)}
                        disabled={createMutation.isPending}
                        size="mobile"
                      >
                        Annulla
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={
                          !canCreateReservation || createMutation.isPending
                        }
                        onClick={handleSubmit}
                        size="mobile"
                      >
                        {createMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creazione...
                          </>
                        ) : (
                          "Conferma"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
