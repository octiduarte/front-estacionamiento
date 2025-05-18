import { useTranslations } from "next-intl";
// Only import icons you actually use from lucide-react
import { CreditCard, Car, Calendar } from "lucide-react";
import PricingTable from "@/components/pricing-table";
import { Button } from "@/components/ui/button";
// Removed: import { useLanguage } from "@/lib/i18n/language-context";

export default function PricingSection() {
  const t = useTranslations("PricingSection");
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
    </section>
  );
}
