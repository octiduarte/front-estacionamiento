import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "@/lib/reservations/create/getVehicleTypes";

export function useReservationVehicleTypes() {
  const { data: vehicleTypes = [], error: errorVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  return {
    vehicleTypes,
    errorVehicleTypes,
  };
}
