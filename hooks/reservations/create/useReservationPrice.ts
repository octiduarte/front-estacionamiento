import { useState } from "react";
import { getTotalPrice } from "@/lib/reservations/getTotalPrice";

export function useReservationPrice() {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const fetchTotalPrice = async (
    vehicleType: string,
    start_time: string,
    end_time: string
  ) => {
    try {
      const vehicleTypeMap: Record<string, number> = {
        car: 1,
        motorcycle: 2,
        suv: 3,
      };
      const vehicleTypeId =
        vehicleTypeMap[vehicleType as keyof typeof vehicleTypeMap] || 0;
      
      const price = await getTotalPrice({
        vehicleTypeId,
        startTime: start_time,
        endTime: end_time,
      });
      setTotalPrice(price);
    } catch (e) {
      setTotalPrice(null);
    }
  };

  return {
    totalPrice,
    fetchTotalPrice,
  };
}
