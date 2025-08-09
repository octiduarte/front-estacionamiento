"use client";

import { Car, Clock, CreditCard, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-36 bg-gradient-to-b from-black to-black/90 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-2xl"
          animate={prefersReducedMotion ? undefined : { y: [0, -60, 0], x: [0, 40, 0], scale: [1, 1.18, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/40 blur-2xl"
          animate={prefersReducedMotion ? undefined : { y: [0, 70, 0], x: [0, -45, 0], scale: [1, 1.13, 1], rotate: [0, 10, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 9, delay: 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-2/3 left-2/3 w-48 h-48 rounded-full bg-primary/30 blur-2xl"
          animate={prefersReducedMotion ? undefined : { y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 7, delay: 0.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>
      
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh] relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center w-full max-w-3xl lg:max-w-7xl mx-auto space-y-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="space-y-4" 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center px-4 py-1 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Green Parking</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-9xl font-bold tracking-tighter text-white drop-shadow-sm">
              {t("title")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl lg:text-lg 2xl:text-xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/reservations/create">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-2 text-lg px-8 py-5 2xl:text-xl 2xl:px-10 2xl:py-6 bg-primary hover:bg-primary/80 shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                >
                  {t("reserveNow")} 
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="h-5 w-5 2xl:h-6 2xl:w-6" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 py-5 2xl:text-xl 2xl:px-10 2xl:py-6 border-primary/50 hover:border-primary text-primary hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                >
                  {t("viewPricing")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 pt-6 2xl:gap-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm py-2 px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Clock className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("service247")}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm py-2 px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <CreditCard className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("securePayment")}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm py-2 px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Calendar className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
              <span className="text-base font-semibold 2xl:text-lg">{t("easyBooking")}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
