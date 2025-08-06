"use client";

import { Price } from "@/types/reservation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  RESERVATION_DURATIONS,
  VEHICLE_TYPE_ID_TO_KEY_MAP,
} from "@/hooks/reservations/create/constants";

interface PricingTableProps {
  prices: Price[];
  t: (key: string) => string;
}

export default function PricingTable({ prices, t }: PricingTableProps) {
  const tHero = useTranslations("HeroSection");

  // Lista de duraciones (hour, daily, weekly, monthly)
  const durations = RESERVATION_DURATIONS;

  // Lista de tipos de vehículo con su ID, clave y label traducido
  const vehicleTypes = Object.entries(VEHICLE_TYPE_ID_TO_KEY_MAP).map(
    ([id, vehicleKey]) => ({
      id: parseInt(id),
      key: vehicleKey,
      label: t(`PricingTable.${vehicleKey}`),
    })
  );

  // Devuelve el precio para un tipo de vehículo y duración
  function getPrice(vehicleType: string, duration: string) {
    const found = prices.find(
      (price) =>
        price.vehicle_type === vehicleType &&
        price.reservation_time === duration
    );
    return found ? `${found.price}€` : "-";
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hour" className="w-full">
        <TabsList className="grid w-full border border-input max-w-md mx-auto grid-cols-4">
          {durations.map((duration) => (
            <TabsTrigger key={duration} value={duration}>
              {t(`PricingTable.${duration}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {durations.map((duration) => (
          <TabsContent key={duration} value={duration} className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {vehicleTypes.map((vehicleType, idx) => (
                <Card
                  key={vehicleType.key}
                  className={`flex flex-col transition-transform duration-200 ${
                    idx === 1
                      ? "sm:scale-105 z-10 border-primary"
                      : "scale-100"
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{vehicleType.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-4xl font-bold mb-4">
                      {getPrice(vehicleType.key, duration)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t(`PricingTable.per${duration.charAt(0).toUpperCase() + duration.slice(1)}`)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/reservations/create?type=${vehicleType.id}`}
                      className="w-full"
                    >
                      <Button className="w-full">{tHero("reserveNow")}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
