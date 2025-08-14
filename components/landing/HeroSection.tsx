"use client";

import {
  Car,
  Clock,
  CreditCard,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-black/90 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-xl md:blur-2xl transform-gpu will-change-[transform]"
          animate={
            prefersReducedMotion || !isInView
              ? undefined
              : { 
                  y: [0, -120, 0], 
                  x: [0, 80, 0], 
                  scale: [1, 1.35, 1],
                  rotate: [0, 15, 0]
                }
          }
          transition={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/40 blur-xl md:blur-2xl transform-gpu will-change-[transform]"
          animate={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  y: [0, 140, 0],
                  x: [0, -90, 0],
                  scale: [1, 1.30, 1],
                  rotate: [0, 20, 0],
                }
          }
          transition={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  duration: 9,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute top-2/3 left-2/3 w-48 h-48 rounded-full bg-primary/30 blur-xl md:blur-2xl transform-gpu will-change-[transform]"
          animate={
            prefersReducedMotion || !isInView
              ? undefined
              : { 
                  y: [0, -80, 0], 
                  x: [0, 60, 0], 
                  scale: [1, 1.25, 1],
                  rotate: [0, -12, 0]
                }
          }
          transition={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  duration: 7,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute top-1/2 right-1/6 w-32 h-32 rounded-full bg-primary/25 blur-lg md:blur-xl transform-gpu will-change-[transform]"
          animate={
            prefersReducedMotion || !isInView
              ? undefined
              : { 
                  y: [0, 100, 0], 
                  x: [0, -50, 0], 
                  scale: [1, 1.4, 1],
                  rotate: [0, 30, 0]
                }
          }
          transition={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  duration: 10,
                  delay: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute bottom-1/6 left-1/6 w-20 h-20 rounded-full bg-primary/35 blur-md transform-gpu will-change-[transform]"
          animate={
            prefersReducedMotion || !isInView
              ? undefined
              : { 
                  y: [0, -60, 0], 
                  x: [0, 70, 0], 
                  scale: [1, 1.6, 1],
                  rotate: [0, -25, 0]
                }
          }
          transition={
            prefersReducedMotion || !isInView
              ? undefined
              : {
                  duration: 6,
                  delay: 0.3,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
      </div>

      <div className="container relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center w-full space-y-8 text-center"
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
              className="inline-flex items-center justify-center mb-4 bg-primary/10 md:backdrop-blur-sm rounded-full border border-primary/20 px-4 py-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">
                Green Parking
              </span>
            </motion.div>
            <h1 className="text-5xl xl:text-7xl 2xl:text-8xl font-bold tracking-tighter text-white drop-shadow-sm">
              {t("title")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
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
                  className="w-full sm:w-auto gap-2 text-lg bg-primary hover:bg-primary/80 shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                >
                  {t("reserveNow")}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg border-primary/50 hover:border-primary text-primary hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                >
                  {t("viewPricing")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-black/40 md:backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">
                {t("service247")}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-black/40 md:backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">
                {t("securePayment")}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-black/40 md:backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">
                {t("easyBooking")}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
