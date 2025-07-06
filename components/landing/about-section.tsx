"use client";

import { Car, Clock, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("AboutSection");
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-gradient-to-b from-background to-muted w-full py-12 md:py-24 lg:py-32 "
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              {t("description")}
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("access247")}</h3>
              <p className="text-muted-foreground text-center">
                {t("access247Desc")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("allVehicles")}</h3>
              <p className="text-muted-foreground text-center">
                {t("allVehiclesDesc")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("securePayment")}</h3>
              <p className="text-muted-foreground text-center">
                {t("securePaymentDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
