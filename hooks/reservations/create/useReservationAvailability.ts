import { useState } from "react";
import { getAvailability } from "@/lib/reservations/create/getAvailability";
import { getVehicleTypeId } from "./constants";

export function useReservationAvailability(t: (key: string) => string) {
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState<boolean>(false);
  const [needsRecheck, setNeedsRecheck] = useState<boolean>(false);
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [lastChecked, setLastChecked] = useState<{
    start_time: string;
    end_time: string;
    vehicleType: string;
  } | null>(null);

  /* Devuelve un true si la fecha de salida es mayor a la de entrada */
  const isTimeValid = (start_time: string, end_time: string): boolean => {
    const entry = new Date(start_time);
    const exit = new Date(end_time);
    return exit > entry;
  };

  const markNeedsRecheck = () => {
    if (hasCheckedAvailability) {
      setNeedsRecheck(true);
      setAvailability(null);
      setSlotDetails([]);
    }
  };

  // Función para verificar si los datos actuales coinciden con los últimos chequeados
  // Solo devuelve true si NO se necesita recheck (needsRecheck === false)
  const isCurrentDataSameAsLastChecked = (
    start_time: string,
    end_time: string,
    vehicleType: string
  ): boolean => {
    return !!(
      lastChecked &&
      lastChecked.start_time === start_time &&
      lastChecked.end_time === end_time &&
      lastChecked.vehicleType === vehicleType &&
      hasCheckedAvailability &&
      !needsRecheck
    );
  };

  const checkAvailability = async (
    start_time: string,
    end_time: string,
    vehicleType: string
  ) => {
    setChecking(true);
    setAvailabilityError("");
    try {
      if (!isTimeValid(start_time, end_time)) {
        setAvailabilityError(t("exitTimeError"));
        setNeedsRecheck(false);
        setAvailability(null);
        setSlotDetails([]);
        setChecking(false);
        return;
      }
      const vehicleTypeId = getVehicleTypeId(vehicleType);
      const data = await getAvailability({
        startTime: start_time,
        endTime: end_time,
        vehicleTypeId,
      });
      setAvailability(data.is_overall_available);
      setSlotDetails(data.slot_details || []);
      setHasCheckedAvailability(true);
      setNeedsRecheck(false);
      setLastChecked({ start_time, end_time, vehicleType });
    } catch (error) {
      setAvailabilityError("Error checking availability:" + error);
    } finally {
      setChecking(false);
    }
  };

  return {
    availability,
    checking,
    slotDetails,
    hasCheckedAvailability,
    needsRecheck,
    availabilityError,
    markNeedsRecheck,
    checkAvailability,
    setAvailabilityError,
    isCurrentDataSameAsLastChecked,
  };
}
