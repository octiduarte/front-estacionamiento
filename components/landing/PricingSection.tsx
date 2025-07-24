"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/lib/landing/getPrices";
import { useTranslations } from "next-intl";
import PricingTable from "@/components/landing/PricingTable";

export default function PricingSection() {
  const t = useTranslations("PricingSection");

  const {
    error,
    isError,
    data: prices,
  } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
    retry: 1,
  });

  return (
    <section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted to-black"
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
          <PricingTable prices={prices ?? []} t={t} />
          {isError && (
            <>
              <span className="text-destructive">{error.message}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
