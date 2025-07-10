"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Spinner from "@/components/ui/spinner";
import { useReservationLookup } from "@/hooks/reservations/manage/useReservationLookup";

interface ReservationLookupProps {
  onReservationFound: (reservation: any) => void;
}

export default function ReservationLookup({ onReservationFound }: ReservationLookupProps) {
  const t = useTranslations("ManageReservation");
  const {
    lookup,
    loading,
    notFound,
    errorMsg,
    updateLookup,
    findReservation,
    isFormValid,
  } = useReservationLookup();

  const handleFind = () => {
    findReservation(onReservationFound);
  };

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
          onChange={(e) =>
            updateLookup("code", e.target.value)
          }
          className="mt-2"
        />
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          value={lookup.email}
          onChange={(e) =>
            updateLookup("email", e.target.value)
          }
        />
        {notFound && (
          <div className="text-destructive text-sm mt-2">
            {t("notFound")}
          </div>
        )}
        {/* No mostrar errorMsg técnico */}
      </div>
      <Button
        className="w-full"
        onClick={handleFind}
        disabled={!isFormValid || loading}
      >
        {loading ? (
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
