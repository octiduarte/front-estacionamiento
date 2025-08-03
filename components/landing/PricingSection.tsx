"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/lib/landing/getPrices";
import { useTranslations } from "next-intl";
import PricingTable from "@/components/landing/PricingTable";
import { useEffect, useState } from "react";
import { DollarSign, Star, Zap } from "lucide-react";

export default function PricingSection() {
  const t = useTranslations("PricingSection");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background con continuidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />
      
      {/* Efectos de fondo dinámicos */}
      <div className="absolute inset-0">
        {/* Grid pattern sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Líneas de energía */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-shimmer" style={{ animationDelay: '2s' }} />
        
        {/* Partículas flotantes */}
        {mounted && [...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/15 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Resplandor central */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-16 text-center">
          
          {/* Header de la sección */}
          <div className={`space-y-6 max-w-4xl ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <DollarSign className="h-4 w-4" />
              {t("transparentPricing")}
            </div>
            
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              {t("title")}
            </h2>
            
            <p className="max-w-[900px] text-gray-300 md:text-xl leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Contenedor de la tabla de precios con efectos */}
          <div className={`w-full max-w-6xl ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            
            {/* Background decorativo para la tabla */}
            <div className="relative">
              {/* Resplandor detrás de la tabla */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-2xl opacity-50" />
              
              {/* Anillos decorativos */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute -bottom-8 -right-8 w-20 h-20 border border-primary/15 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
              
              {/* Contenedor principal de la tabla */}
              <div className="relative bg-black/60 backdrop-blur-sm rounded-3xl border border-primary/30 p-8 shadow-2xl">
                <PricingTable prices={prices ?? []} t={t} />
                
                {/* Efecto de brillo en los bordes */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>

            {/* Error handling con estilo */}
            {isError && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <span className="text-red-400 font-medium">{error.message}</span>
              </div>
            )}
          </div>

          {/* Features adicionales de pricing */}
          <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            
            <div className="group text-center">
              <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-colors duration-300" />
                <div className="relative bg-primary/20 rounded-full p-3 group-hover:bg-primary/30 transition-colors duration-300">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t("noHiddenFees")}</h3>
              <p className="text-gray-400 text-sm">{t("noHiddenFeesDesc")}</p>
            </div>
            
            <div className="group text-center">
              <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-colors duration-300" />
                <div className="relative bg-primary/20 rounded-full p-3 group-hover:bg-primary/30 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t("instantReservation")}</h3>
              <p className="text-gray-400 text-sm">{t("instantReservationDesc")}</p>
            </div>
            
            <div className="group text-center">
              <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-colors duration-300" />
                <div className="relative bg-primary/20 rounded-full p-3 group-hover:bg-primary/30 transition-colors duration-300">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t("flexiblePricing")}</h3>
              <p className="text-gray-400 text-sm">{t("flexiblePricingDesc")}</p>
            </div>
          </div>

          {/* Call to action mejorado */}
          <div className={`${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative px-8 py-4 bg-black/60 backdrop-blur-sm rounded-lg border border-primary/30">
                <p className="text-gray-300 text-lg">
                  <span className="text-primary font-semibold">{t("specialOffer")}</span> 
                  {" "}{t("firstReservationDiscount")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transición hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
