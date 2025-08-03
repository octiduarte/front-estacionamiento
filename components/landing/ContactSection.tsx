"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      
      {/* Background final con continuidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/8 to-black" />
      
      {/* Efectos de fondo finales */}
      <div className="absolute inset-0">
        {/* Grid pattern más denso para la sección final */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-primary/15 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        
        {/* Partículas flotantes finales */}
        {mounted && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/12 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 5 + 6}s`,
            }}
          />
        ))}
      </div>

      {/* Resplandor central */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-16 text-center">
          
          {/* Header de la sección */}
          <div className={`space-y-6 max-w-4xl ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <MessageCircle className="h-4 w-4" />
              {t("getInTouch")}
            </div>
            
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              {t("title")}
            </h2>
            
            <p className="max-w-[900px] text-gray-300 md:text-xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Contenido principal */}
          <div className={`mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            
            {/* Mapa con efectos modernos */}
            <div className="relative group">
              {/* Efectos de fondo para el mapa */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl" />
              
              <Card className="relative overflow-hidden bg-black/60 backdrop-blur-sm border border-primary/30 shadow-2xl group-hover:border-primary/50 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative">
                    <iframe
                      src={t("mapUrl")}
                      width="100%"
                      height="100%"
                      className="aspect-video lg:aspect-square w-full border-0 rounded-t-xl"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={t("mapTitle", { defaultValue: "Our Location" })}
                      aria-label={t("mapAriaLabel", { defaultValue: "Map showing our office location" })}
                    />
                    
                    {/* Overlay con efectos */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Indicador de ubicación flotante */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/30">
                      <MapPin className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-white text-sm font-medium">{t("weAreHere")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información de contacto */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Visítanos */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/20 p-6 text-center backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                      <div className="relative p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <div className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {t("visitUs")}
                    </div>
                    
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {t("addressLine1")}<br />
                      {t("addressLine2")}<br />
                      {t("addressLine3")}
                    </div>
                  </div>
                </div>

                {/* Llámanos */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/20 p-6 text-center backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                      <div className="relative p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <div className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {t("callUs")}
                    </div>
                    
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <div className="font-medium text-primary">{t("phoneValue")}</div>
                      <div className="text-xs mt-1">{t("hours")}</div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/20 p-6 text-center backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                      <div className="relative p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <div className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {t("emailUs")}
                    </div>
                    
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <div className="font-medium text-primary">{t("emailValue")}</div>
                      <div className="text-xs mt-1">{t("emailNote")}</div>
                    </div>
                  </div>
                </div>

                {/* Redes Sociales */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-black/80 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/20 p-6 text-center backdrop-blur-sm hover:border-primary/40 transition-all duration-500 group-hover:transform group-hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500" />
                      <div className="relative p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <span className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {t("followUs")}
                    </span>
                    
                    <div className="flex gap-3 justify-center">
                      <Link 
                        href={t("facebookUrl")} 
                        aria-label="Facebook" 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110 group/social"
                      >
                        <Facebook className="h-5 w-5 text-primary group-hover/social:scale-110 transition-transform" />
                      </Link>
                      <Link 
                        href={t("instagramUrl")} 
                        aria-label="Instagram" 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110 group/social"
                      >
                        <Instagram className="h-5 w-5 text-primary group-hover/social:scale-110 transition-transform" />
                      </Link>
                      <Link 
                        href={t("twitterUrl")} 
                        aria-label="Twitter" 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110 group/social"
                      >
                        <Twitter className="h-5 w-5 text-primary group-hover/social:scale-110 transition-transform" />
                      </Link>
                      <Link 
                        href={t("linkedinUrl")} 
                        aria-label="LinkedIn" 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110 group/social"
                      >
                        <Linkedin className="h-5 w-5 text-primary group-hover/social:scale-110 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action final */}
          <div className={`w-full max-w-4xl ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />
              <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl border border-primary/30 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t("readyToReserve")}
                </h3>
                <p className="text-gray-300 mb-6">
                  {t("joinThousands")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reservations/create" className="group/button">
                    <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all duration-300 group-hover/button:scale-105 group-hover/button:shadow-lg group-hover/button:shadow-primary/25">
                      {t("reserveNow")}
                    </button>
                  </Link>
                  <Link href="tel:+1234567890">
                    <button className="px-8 py-4 bg-transparent border border-primary/50 text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-105">
                      {t("callNow")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final del background - sin transición para ser la última sección */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}