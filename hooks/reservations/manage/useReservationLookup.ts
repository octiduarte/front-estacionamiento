
import { useState } from "react";
import { getReservationManage } from "@/lib/reservations/manage/getReservationManage";
import { convertUTCToItaly } from "@/lib/italy-time";
import { getPaymentMethodKeyFromId, getVehicleTypeKeyFromId } from "@/hooks/reservations/create/constants";

export const useReservationLookup = () => {
  const [lookup, setLookup] = useState({ code: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const updateLookup = (field: string, value: string) => {
    setLookup(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetLookup = () => {
    setLookup({ code: "", email: "" });
    setNotFound(false);
    setErrorMsg("");
  };

  const findReservation = async (onFound: (reservation: any) => void) => {
    setNotFound(false);
    setErrorMsg("");
    setLoading(true);
    
    try {
      const res = await getReservationManage(lookup.code, lookup.email);
      
      // Usar utilidad centralizada
      const startDateTime = convertUTCToItaly(res.start_time);
      const endDateTime = convertUTCToItaly(res.end_time);
      
      // Mapear los datos recibidos a la estructura esperada
      const mapped = {
        code: res.code,
        firstName: res.user_name?.split(" ")[0] || "",
        lastName: res.user_name?.split(" ").slice(1).join(" ") || "",
        email: res.user_email,
        vehicleType: getVehicleTypeKeyFromId(res.vehicle_type_id),
        entryDate: startDateTime.date,
        entryTime: startDateTime.time,
        exitDate: endDateTime.date,
        exitTime: endDateTime.time,
        licensePlate: res.vehicle_plate,
        vehicleModel: res.vehicle_model,
        paymentMethod: getPaymentMethodKeyFromId(res.payment_method_id),
      };
      
      onFound(mapped);
    } catch (e: any) {
      setNotFound(true);
      setErrorMsg("");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = lookup.code.trim() !== "" && lookup.email.trim() !== "";

  return {
    lookup,
    loading,
    notFound,
    errorMsg,
    updateLookup,
    resetLookup,
    findReservation,
    isFormValid,
  };
};
