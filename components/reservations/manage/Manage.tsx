"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import ReservationLookup from "./ReservationLookup";
import ReservationDetails from "./ReservationDetails";
import { useManageReservation } from "@/hooks/reservations/manage/useManageReservation";
import ReservationCancelled from "./ReservationCancelled";

export default function ManageReservation() {
  const t = useTranslations("ManageReservation");
  const {
    step,
    reservation,
    cancelled,
    handleReservationFound,
    handleBack,
    handleCancel,
  } = useManageReservation();

  return (
    <div className=" bg-gradient-to-b from-muted to-black min-h-screen flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
              <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <ReservationLookup
                    key="lookup"
                    onReservationFound={handleReservationFound}
                  />
                )}
                {step === 2 && reservation && (
                  <ReservationDetails
                    key="details"
                    reservation={reservation}
                    onBack={handleBack}
                    onCancel={handleCancel}
                  />
                )}
                {step === 3 && cancelled && (
                  <ReservationCancelled key="cancelled" onBack={handleBack} />
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
