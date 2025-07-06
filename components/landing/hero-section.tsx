"use client";

import { Car, Clock, CreditCard, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-muted to-black"
    >
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                {t("title")}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t("subtitle")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/reservations/create">
                <Button size="lg" className="w-full sm:w-auto gap-1">
                  {t("reserveNow")} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("viewPricing")}
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{t("service247")}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm">{t("securePayment")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">{t("easyBooking")}</span>
              </div>
            </div>
          </div>
          {/* Imagen del auto, solo visible en lg+ */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-3xl opacity-50"></div>
              <div className="relative bg-muted rounded-3xl overflow-hidden border shadow-xl w-full h-full flex items-center justify-center">
                <Car className="h-32 w-32 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
