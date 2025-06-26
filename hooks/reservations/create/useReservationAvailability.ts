import { useState } from "react";
import { getAvailability } from "@/lib/reservations/getAvailability";

export function useReservationAvailability(t: (key: string) => string) {
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState<boolean>(false);
  const [needsRecheck, setNeedsRecheck] = useState<boolean>(false);

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

  const checkAvailability = async (
    start_time: string,
    end_time: string,
    vehicleType: string,
    setError: (error: string) => void
  ) => {
    setChecking(true);
    setError("");
    try {
      if (!isTimeValid(start_time, end_time)) {
        setError(t("exitTimeError"));
        setNeedsRecheck(false);
        setAvailability(null);
        setSlotDetails([]);
        setChecking(false);
        return;
      }
      
      const vehicleTypeMap: Record<string, number> = {
        car: 1,
        motorcycle: 2,
        suv: 3,
      };
      const vehicleTypeId =
        vehicleTypeMap[vehicleType as keyof typeof vehicleTypeMap] || 0;
      
      const data = await getAvailability({
        startTime: start_time,
        endTime: end_time,
        vehicleTypeId,
      });
      
      setAvailability(data.is_overall_available);
      setSlotDetails(data.slot_details || []);
      setHasCheckedAvailability(true);
      setNeedsRecheck(false);
    } catch (error) {
      setError("Error checking availability:" + error);
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
    markNeedsRecheck,
    checkAvailability,
  };
}
