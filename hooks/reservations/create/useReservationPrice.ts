import { useState } from "react";
import { getTotalPrice } from "@/lib/reservations/getTotalPrice";
import { getVehicleTypeId } from "./constants";

export function useReservationPrice() {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const fetchTotalPrice = async (
    vehicleType: string,
    start_time: string,
    end_time: string
  ) => {
    try {
      const vehicleTypeId = getVehicleTypeId(vehicleType);
      
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
