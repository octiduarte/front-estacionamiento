"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
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
                    className="space-y-6"
                  >
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-primary text-center">
                      {t("cancelled")}
                    </h4>
                    <p className="text-muted-foreground text-center">
                      {t("cancelledThankYou")}
                    </p>
                    <div className="flex flex-col gap-3 md:flex-row mt-6">
                      <Button 
                        variant="outline"
                        onClick={handleBack}
                        className="w-full md:flex-1"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("back")}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                        className="w-full md:flex-1"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        {t("goHome")}
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
