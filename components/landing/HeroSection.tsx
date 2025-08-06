"use client";

import { Car, Clock, CreditCard, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-56 bg-gradient-to-b from-muted to-black"
    >
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-9xl font-bold tracking-tighter ">
              {t("title")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl lg:text-lg 2xl:text-xl text-muted-foreground ">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link href="/reservations/create">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-5 2xl:text-xl 2xl:px-10 2xl:py-6">
                {t("reserveNow")} <ChevronRight className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-5 2xl:text-xl 2xl:px-10 2xl:py-6">
                {t("viewPricing")}
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 2xl:gap-8">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("service247")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("securePayment")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("easyBooking")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
