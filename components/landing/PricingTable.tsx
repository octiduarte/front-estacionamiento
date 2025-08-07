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
import { motion } from "framer-motion";
import { Car, ChevronRight } from "lucide-react";

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

  const getVehicleIcon = (type: string) => {
    switch(type) {
      case 'car':
        return <Car className="h-6 w-6 text-primary" />;
      case 'motorcycle':
        return <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 16C16.8807 16 18 14.8807 18 13.5C18 12.1193 16.8807 11 15.5 11C14.1193 11 13 12.1193 13 13.5C13 14.8807 14.1193 16 15.5 16Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 16C9.88071 16 11 14.8807 11 13.5C11 12.1193 9.88071 11 8.5 11C7.11929 11 6 12.1193 6 13.5C6 14.8807 7.11929 16 8.5 16Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 13.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 13.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 13.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10.5 8L12.5 6H14.5L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 8.5C16 8.5 14.7985 9.5 13 9.5C11.2015 9.5 9.5 8.5 9.5 8.5L10.5 4L13 3L15.5 4L16 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>;
      case 'truck':
        return <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 16V6C16 4.89543 15.1046 4 14 4H2C0.89543 4 0 4.89543 0 6V16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8H19.5858C19.851 8 20.1054 8.10536 20.2929 8.29289L23.7071 11.7071C23.8946 11.8946 24 12.149 24 12.4142V16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 16C4 14.8954 4.89543 14 6 14C7.10457 14 8 14.8954 8 16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 16C16 14.8954 16.8954 14 18 14C19.1046 14 20 14.8954 20 16" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" />
        </svg>;
      default:
        return <Car className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hour" className="w-full">
        <TabsList className="grid w-full border border-primary/30 max-w-md mx-auto grid-cols-4 bg-black/40 backdrop-blur-md overflow-hidden rounded-xl">
          {durations.map((duration) => (
            <TabsTrigger 
              key={duration} 
              value={duration}
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              {t(`PricingTable.${duration}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {durations.map((duration) => (
          <TabsContent key={duration} value={duration} className="mt-8">
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8 2xl:gap-10">
              {vehicleTypes.map((vehicleType, idx) => (
                <motion.div
                  key={vehicleType.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card
                    className={`flex flex-col transition-all duration-300 h-full overflow-hidden
                      ${idx === 1
                        ? "sm:scale-105 z-10 border-primary bg-black/60 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20"
                        : "scale-100 border-primary/20 bg-black/40 hover:border-primary/50"
                      } backdrop-blur-md hover:-translate-y-1`
                    }
                  >
                    <CardHeader className="2xl:p-8 border-b border-primary/10">
                      <div className="flex justify-between items-center">
                        <CardTitle className="lg:text-xl 2xl:text-2xl flex items-center gap-2">
                          {getVehicleIcon(vehicleType.key)}
                          {vehicleType.label}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 2xl:px-8 py-8">
                      <div className="text-4xl font-bold mb-4 lg:text-4xl 2xl:text-5xl text-white">
                        {getPrice(vehicleType.key, duration)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 lg:text-sm 2xl:text-base">
                        {t(`PricingTable.per${duration.charAt(0).toUpperCase() + duration.slice(1)}`)}
                      </p>
                    </CardContent>
                    <CardFooter className="2xl:p-8 pt-0">
                      <Link
                        href={`/reservations/create?type=${vehicleType.id}`}
                        className="w-full"
                      >
                        <Button 
                          className={`w-full lg:text-base 2xl:text-lg 2xl:py-6 group ${
                            idx === 1 
                              ? "bg-primary hover:bg-primary/80" 
                              : "bg-primary/80 hover:bg-primary"
                          } shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300`}
                        >
                          {tHero("reserveNow")} 
                          <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
