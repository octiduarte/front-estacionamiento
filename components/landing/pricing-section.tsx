import { getPrices } from "@/lib/landing/getPrices";
import { getTranslations } from "next-intl/server";
import PricingTable from "@/components/pricing-table";

export default async function PricingSection() {
  const t = await getTranslations("PricingSection");
  const prices = await getPrices();
  return (
    <section
      id="pricing"
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
          <PricingTable prices={prices} />
        </div>
      </div>
    </section>
  );
}
