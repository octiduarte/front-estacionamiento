"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/lib/landing/getPrices";
import { useTranslations } from "next-intl";
import PricingTable from "@/components/landing/pricing-table";
import { motion } from "framer-motion";

export default function PricingSection() {
  const t = useTranslations("PricingSection");

  const { data: prices } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
    staleTime: 24*60 * 60 * 1000, // 24 hours  
    gcTime: 7* 24 * 60 * 60 * 1000, // 7 days
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-gradient-to-b from-muted to-black"
    >
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
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
            <PricingTable prices={prices ?? []} />
          </div>
        </div>
      </section>
    </motion.section>
  );
}
