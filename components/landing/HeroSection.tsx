"use client";

import { Car, Clock, CreditCard, Calendar, ChevronRight, Sparkles, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background base negro */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Gradiente animado principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-primary/10 to-black animate-pulse-glow" />
      
      {/* Efectos de partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Líneas de movimiento */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center min-h-screen py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Columna izquierda - Contenido */}
            <div className="flex flex-col justify-center space-y-8">
              <div className={`space-y-6 ${mounted ? 'animate-fadeInLeft' : 'opacity-0'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  {t("smartParking")}
                </div>
                
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                  {t("title")}
                </h1>
                
                <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed">
                  {t("subtitle")}
                </p>
              </div>

              {/* Botones con efectos */}
              <div className={`flex flex-col sm:flex-row gap-4 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                <Link href="/reservations/create" className="group">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    {t("reserveNow")} 
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    {t("viewPricing")}
                  </Button>
                </Link>
              </div>

              {/* Features con animaciones */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                <div className="group flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-primary/20 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {t("service247")}
                  </span>
                </div>
                
                <div className="group flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-primary/20 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {t("securePayment")}
                  </span>
                </div>
                
                <div className="group flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-primary/20 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {t("easyBooking")}
                  </span>
                </div>
              </div>
            </div>

            {/* Columna derecha - Visual del auto */}
            <div className={`hidden lg:flex justify-center items-center ${mounted ? 'animate-fadeInRight' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="relative w-full max-w-lg">
                
                {/* Efecto de glow principal */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-full blur-3xl opacity-60 animate-pulse-glow" />
                
                {/* Anillos orbitales */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-4 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                
                {/* Contenedor principal del auto */}
                <div className="relative aspect-square bg-gradient-to-br from-black/60 via-primary/10 to-black/60 rounded-3xl backdrop-blur-sm border border-primary/30 shadow-2xl overflow-hidden">
                  
                  {/* Efecto de grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Puntos de estacionamiento animados */}
                  <div className="absolute top-6 left-6 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div className="absolute top-6 right-6 w-3 h-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-6 left-6 w-3 h-3 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute bottom-6 right-6 w-3 h-3 bg-primary/80 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                  
                  {/* Auto central con animación */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-8 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                      <Car className="relative h-32 w-32 text-primary animate-float group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  
                  {/* Líneas de velocidad */}
                  <div className="absolute top-1/2 left-4 w-8 h-px bg-primary/60 animate-shimmer" />
                  <div className="absolute top-1/2 left-4 translate-y-2 w-6 h-px bg-primary/40 animate-shimmer" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute top-1/2 left-4 translate-y-4 w-4 h-px bg-primary/20 animate-shimmer" style={{ animationDelay: '0.6s' }} />
                  
                  {/* Indicadores de ubicación */}
                  <div className="absolute top-8 right-8 flex items-center gap-1 text-primary/80">
                    <MapPin className="h-4 w-4 animate-pulse" />
                    <Zap className="h-3 w-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                {/* Texto flotante */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="px-4 py-2 bg-black/80 rounded-lg border border-primary/30 backdrop-blur-sm">
                    <span className="text-primary text-sm font-medium">{t("advancedTechnology")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
        <div className="flex flex-col items-center gap-2 text-primary/60">
          <span className="text-xs font-medium">{t("explore")}</span>
          <ChevronRight className="h-4 w-4 rotate-90 animate-bounce" />
        </div>
      </div>

      {/* Transición fluida hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/80" />
    </section>
  );
}
