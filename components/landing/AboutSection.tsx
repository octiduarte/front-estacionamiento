"use client";

import { Car, Clock, CreditCard, Shield, Camera, Home, Sparkles, Zap, Droplets } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function AboutSection() {
  const t = useTranslations("AboutSection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  
  const services = [
    {
      icon: Clock,
      title: t("access247"),
      description: t("access247Desc"),
    },
    {
      icon: Car,
      title: t("allVehicles"), 
      description: t("allVehiclesDesc"),
    },
    {
      icon: CreditCard,
      title: t("securePayment"),
      description: t("securePaymentDesc"),
    },
    {
      icon: Camera,
      title: t("security24"),
      description: t("security24Desc"),
    },
    {
      icon: Home,
      title: t("coveredParking"),
      description: t("coveredParkingDesc"),
    },
    {
      icon: Sparkles,
      title: t("carWash"),
      description: t("carWashDesc"),
    },
    {
      icon: Zap,
      title: t("electricCharging"),
      description: t("electricChargingDesc"),
    },
    {
      icon: Droplets,
      title: t("showers"),
      description: t("showersDesc"),
    },
  ];
  
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-black/95 to-black/90 w-full py-12 md:py-24 lg:py-32 2xl:py-56 relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full border-2 border-primary/50 opacity-70 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, 70, 0], x: [0, -45, 0], scale: [1, 1.13, 1], rotate: [0, 10, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 9, delay: 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, -60, 0], x: [0, 40, 0], scale: [1, 1.18, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-3/4 left-3/3 w-32 h-32 rounded-full border-2 border-primary/70 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.10, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 10, delay: 0.7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-8 text-center will-change-transform"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          style={{ translateZ: 0 }}
        >
          <motion.div 
            className="space-y-4 will-change-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ translateZ: 0 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{t("title")}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl text-white drop-shadow-sm">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed mx-auto">
              {t("description")}
            </p>
          </motion.div>
          
          <motion.div
            className="w-full max-w-6xl mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <motion.div
                        className="flex flex-col items-center space-y-4 p-6 h-full rounded-2xl bg-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
                        whileHover={{ y: -10, scale: 1.02 }}
                        style={{ translateZ: 0 }}
                      >
                        <motion.div 
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 lg:h-18 lg:w-18 2xl:h-20 2xl:w-20 shadow-md shadow-primary/20 will-change-transform"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          style={{ translateZ: 0 }}
                        >
                          <IconComponent className="h-8 w-8 text-primary lg:h-9 lg:w-9 2xl:h-10 2xl:w-10" />
                        </motion.div>
                        <h3 className="text-xl font-bold lg:text-xl 2xl:text-2xl text-center">{service.title}</h3>
                        <p className="text-muted-foreground text-center text-sm">
                          {service.description}
                        </p>
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-12 border-primary/20 bg-black/50 hover:bg-primary/20 text-primary hover:text-primary-foreground" />
              <CarouselNext className="hidden sm:flex -right-12 border-primary/20 bg-black/50 hover:bg-primary/20 text-primary hover:text-primary-foreground" />
            </Carousel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
