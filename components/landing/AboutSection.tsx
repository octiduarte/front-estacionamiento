"use client";

import { Car, Clock, CreditCard, Shield, Zap, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AboutSection() {
  const t = useTranslations("AboutSection");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background con continuidad del HeroSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black" />
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        {/* Líneas diagonales sutiles */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
        
        {/* Partículas flotantes continuando del hero */}
        {mounted && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-16 text-center">
          
          {/* Header de la sección */}
          <div className={`space-y-6 max-w-4xl ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              {t("ourServices")}
            </div>
            
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              {t("title")}
            </h2>
            
            <p className="max-w-[900px] text-gray-300 md:text-xl leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Grid de características con efectos modernos */}
          <div className={`w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            
            {/* Feature 1 - 24/7 Access */}
            <div className="group relative">
              {/* Background con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 rounded-2xl" />
              
              {/* Contenido */}
              <div className="relative p-8 rounded-2xl border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                
                {/* Icono con efectos */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 mx-auto">
                    <Clock className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Anillos orbitales pequeños */}
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '10s' }} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {t("access247")}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {t("access247Desc")}
                </p>

                {/* Indicador de movimiento */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Feature 2 - All Vehicles */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 rounded-2xl" />
              
              <div className="relative p-8 rounded-2xl border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 mx-auto">
                    <Car className="h-8 w-8 text-primary group-hover:scale-110 animate-float transition-transform duration-300" />
                  </div>
                  
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {t("allVehicles")}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {t("allVehiclesDesc")}
                </p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>

            {/* Feature 3 - Secure Payment */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 rounded-2xl" />
              
              <div className="relative p-8 rounded-2xl border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 mx-auto">
                    <CreditCard className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '12s' }} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {t("securePayment")}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {t("securePaymentDesc")}
                </p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats section adicional */}
          <div className={`w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            
            <div className="text-center group">
              <div className="relative mb-2">
                <span className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                  500+
                </span>
                <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-gray-400 text-sm">{t("availableSpaces")}</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-2">
                <span className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                  24/7
                </span>
                <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-gray-400 text-sm">{t("guaranteedAccess")}</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-2">
                <span className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                  99%
                </span>
                <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-gray-400 text-sm">{t("availability")}</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-2">
                <span className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                  5★
                </span>
                <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-gray-400 text-sm">{t("rating")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transición hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
