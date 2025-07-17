"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Spinner from "@/components/ui/spinner";
import { useReservationLookup } from "@/hooks/reservations/manage/useReservationLookup";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getReservationManage } from "@/lib/reservations/manage/getReservationManage";
import { convertUTCToItaly } from "@/lib/italy-time";
import {
  getPaymentMethodNameKey,
  getVehicleTypeKeyFromId,
} from "@/hooks/reservations/create/constants";
import { MappedReservation } from "@/types/reservation";
interface ReservationLookupProps {
  onReservationFound: (reservation: MappedReservation) => void;
}

export default function ReservationLookup({
  onReservationFound,
}: ReservationLookupProps) {
  const t = useTranslations("ManageReservation");
  const { lookup, updateLookup, isFormValid } = useReservationLookup();

  const { isFetching, refetch } = useQuery({
    queryKey: ["reservation", lookup.code, lookup.email],
    queryFn: () => getReservationManage(lookup.code, lookup.email),
    enabled: false,
    retry: 0,
  });

  const handleFind = async () => {

    const {data,isError,error} = await refetch();
    if (data) {
      // Si el status es distinto de active, Mostramos mensaje que no esta activa
      if (data.status !== "active") {
        toast.error(t("notActive"));
        return;
      }
      // Mapear los datos recibidos a la estructura esperada
      const startDateTime = convertUTCToItaly(data.start_time);
      const endDateTime = convertUTCToItaly(data.end_time);
      const mapped = {
        code: data.code,
        firstName: data.user_name?.split(" ")[0] || "",
        lastName: data.user_name?.split(" ").slice(1).join(" ") || "",
        email: data.user_email,
        vehicleType: getVehicleTypeKeyFromId(data.vehicle_type_id),
        entryDate: startDateTime.date,
        entryTime: startDateTime.time,
        exitDate: endDateTime.date,
        exitTime: endDateTime.time,
        licensePlate: data.vehicle_plate,
        vehicleModel: data.vehicle_model,
        paymentMethod: getPaymentMethodNameKey(data.payment_method_name),
      };
      onReservationFound(mapped);
    } else if (isError) {
      if (
        // Si es un 404 (No se encontro con ese valor de codigo o email)
        error.message === "CANNOT_FOUND" ||
        error?.toString().includes("CANNOT_FOUND")
      ) {
        toast.error(t("notFound"));
      } else {
        toast.error(error.message);
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner />
        <p className="mt-4 text-muted-foreground">{t("searching")}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Label>{t("lookupLabel")}</Label>
        <Input
          name="code"
          placeholder={t("reservationCode")}
          value={lookup.code}
          onChange={(e) => updateLookup("code", e.target.value)}
          className="mt-2"
        />
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          value={lookup.email}
          onChange={(e) => updateLookup("email", e.target.value)}
        />
      </div>
      <Button
        className="w-full"
        onClick={handleFind}
        disabled={!isFormValid || isFetching}
      >
        {t("findReservation")}
      </Button>
    </motion.div>
  );
}
