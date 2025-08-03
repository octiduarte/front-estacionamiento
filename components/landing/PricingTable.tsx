"use client";

import { Price } from "@/types/reservation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Star, Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface PricingTableProps {
  prices: Price[];
  t: (key: string) => string;
}

export default function PricingTable({ prices, t }: PricingTableProps) {
  const tHero = useTranslations("HeroSection");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lista de duraciones (hour, daily, weekly, monthly)
  const durations = RESERVATION_DURATIONS;

  // Lista de tipos de vehículo con su clave y label traducido
  const vehicleTypes = Object.values(VEHICLE_TYPE_ID_TO_KEY_MAP).map(
    (vehicleKey) => ({
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

  // Iconos para cada tipo de vehículo
  const getVehicleIcon = (index: number) => {
    const icons = [Star, Crown, Zap];
    return icons[index] || Star;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="hour" className="w-full">
        
        {/* Tabs mejorados con efectos */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-50" />
          <TabsList className="relative grid w-full max-w-lg mx-auto grid-cols-4 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-2xl p-1">
            {durations.map((duration, index) => (
              <TabsTrigger 
                key={duration} 
                value={duration}
                className="relative data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium"
              >
                <span className="relative z-10">
                  {t(`PricingTable.${duration}`)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {durations.map((duration) => (
          <TabsContent key={duration} value={duration} className="mt-8">
            <div className={`grid gap-8 md:grid-cols-3 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              {vehicleTypes.map((vehicleType, idx) => {
                const isPopular = idx === 1;
                const Icon = getVehicleIcon(idx);
                
                return (
                  <div key={vehicleType.key} className="relative group">
                    
                    {/* Badge "Popular" para el plan del medio */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-primary text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                          {t("PricingTable.mostPopular")}
                        </div>
                      </div>
                    )}

                    {/* Efectos de fondo para el card popular */}
                    {isPopular && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse-glow" />
                      </>
                    )}

                    {/* Efectos para cards normales */}
                    {!isPopular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                    )}

                    <Card
                      className={`relative flex flex-col transition-all duration-500 group-hover:scale-105 bg-black/60 backdrop-blur-sm border-primary/30 hover:border-primary/50 shadow-xl ${
                        isPopular
                          ? "scale-105 border-primary/50 shadow-2xl shadow-primary/25"
                          : "scale-100"
                      }`}
                    >
                      <CardHeader className="text-center relative">
                        
                        {/* Icono con efectos */}
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 mx-auto">
                            <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          
                          {/* Anillo orbital para el plan popular */}
                          {isPopular && (
                            <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin opacity-60" style={{ animationDuration: '15s' }} />
                          )}
                        </div>

                        <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                          {vehicleType.label}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-1 text-center">
                        <div className="relative mb-6">
                          <div className="text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                            {getPrice(vehicleType.key, duration)}
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            {t(`PricingTable.per${duration.charAt(0).toUpperCase() + duration.slice(1)}`)}
                          </p>
                          
                          {/* Línea decorativa */}
                          <div className="w-16 h-px bg-primary/30 mx-auto mt-4 group-hover:w-24 group-hover:bg-primary/50 transition-all duration-300" />
                        </div>

                        {/* Features incluidas */}
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            <span>{t("PricingTable.access247")}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <span>{t("PricingTable.guaranteedSecurity")}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                            <span>{t("PricingTable.flexibleCancellation")}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-6">
                        <Link
                          href={`/reservations/create?type=${vehicleType.key}`}
                          className="w-full group/button"
                        >
                          <Button 
                            className={`w-full group-hover/button:scale-105 transition-all duration-300 ${
                              isPopular 
                                ? 'bg-primary hover:bg-primary/90 text-black font-bold shadow-lg hover:shadow-primary/25' 
                                : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50'
                            }`}
                          >
                            {tHero("reserveNow")}
                          </Button>
                        </Link>
                      </CardFooter>

                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </Card>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
