"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import { useReservationLookup } from "@/hooks/reservations/manage/useReservationLookup";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getReservationManage } from "@/lib/reservations/manage/getReservationManage";
import { convertUTCToItaly } from "@/lib/italy-time";
import {
  getPaymentMethodNameKey,
  getVehicleTypeKeyFromId,
} from "@/hooks/reservations/create/constants";

interface ReservationLookupProps {
  onReservationFound: (reservation: any) => void;
}

export default function ReservationLookup({
  onReservationFound,
}: ReservationLookupProps) {
  const t = useTranslations("ManageReservation");
  const { lookup, updateLookup, isFormValid } = useReservationLookup();

  const [errorType, setErrorType] = useState<string | null>(null);

  const { isFetching, refetch } = useQuery({
    queryKey: ["reservation", lookup.code, lookup.email],
    queryFn: () => getReservationManage(lookup.code, lookup.email),
    enabled: false,
    retry: 0,
  });

  const handleFind = async () => {
    setErrorType(null);
    const result = await refetch();
    if (result.data) {
      if (result.data.status !== "active") {
        setErrorType("notActive");
        toast.error(t("notActive"));
        return;
      }
      // Mapear los datos recibidos a la estructura esperada
      const startDateTime = convertUTCToItaly(result.data.start_time);
      const endDateTime = convertUTCToItaly(result.data.end_time);
      const mapped = {
        code: result.data.code,
        firstName: result.data.user_name?.split(" ")[0] || "",
        lastName: result.data.user_name?.split(" ").slice(1).join(" ") || "",
        email: result.data.user_email,
        vehicleType: getVehicleTypeKeyFromId(result.data.vehicle_type_id),
        entryDate: startDateTime.date,
        entryTime: startDateTime.time,
        exitDate: endDateTime.date,
        exitTime: endDateTime.time,
        licensePlate: result.data.vehicle_plate,
        vehicleModel: result.data.vehicle_model,
        paymentMethod: getPaymentMethodNameKey(result.data.payment_method_name),
      };
      onReservationFound(mapped);
    } else if (result.error) {
      setErrorType("notFound");
      toast.error(t("notFound"));
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
      transition={{ duration: 0.3 }}
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
        {isFetching ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            <span>{t("searching")}</span>
          </div>
        ) : (
          t("findReservation")
        )}
      </Button>
    </motion.div>
  );
}
