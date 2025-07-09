"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import ReservationLookup from "./ReservationLookup";
import ReservationDetails from "./ReservationDetails";
import { useManageReservation } from "@/hooks/reservations/manage/useManageReservation";

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
                  <motion.div
                    key="cancelled"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-600">
                        {t("cancelled")}
                      </h3>
                      <Button className="mt-6" onClick={handleBack}>
                        {t("back")}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
