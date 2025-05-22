"use client";

import { useTranslations } from "next-intl";
import PricingTable from "@/components/pricing-table";
import { motion } from "framer-motion";

export default function PricingSection() {
  const t = useTranslations("PricingSection");
  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full py-12 md:py-24 lg:py-32 bg-muted"
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
          <PricingTable />
        </div>
      </div>
    </motion.section>
  );
}
