import Image from "next/image";
import { Car, Clock, CreditCard, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HeroSection() {
  const t = await getTranslations("HeroSection");
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
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
          <div className="flex items-center justify-center">
            <div className="relative h-[250px] sm:h-[350px] w-full overflow-hidden rounded-xl">
              <Image
                src="/window.svg"
                alt={t("imageAlt")}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
