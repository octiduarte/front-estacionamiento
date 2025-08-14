"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/lib/landing/getPrices";
import { useTranslations } from "next-intl";
import PricingTable from "@/components/landing/PricingTable";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CreditCard, Tag } from "lucide-react";

export default function PricingSection() {
  const t = useTranslations("PricingSection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();

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
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-56 bg-gradient-to-b from-black/95 to-black/90 relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_900px]"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/30 blur-2xl transform-gpu will-change-[transform]"
          animate={prefersReducedMotion || !isInView ? undefined : { 
            y: [0, -120, 0], 
            x: [0, 80, 0], 
            scale: [1, 1.36, 1],
            rotate: [0, 25, 0]
          }}
          transition={prefersReducedMotion || !isInView ? undefined : { 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/40 blur-2xl opacity-60 transform-gpu will-change-[transform]"
          animate={prefersReducedMotion || !isInView ? undefined : { 
            y: [0, 140, 0], 
            x: [0, -90, 0], 
            scale: [1, 1.26, 1], 
            rotate: [0, -20, 0] 
          }}
          transition={prefersReducedMotion || !isInView ? undefined : { 
            duration: 9, 
            delay: 0.5, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-1/6 left-1/2 w-56 h-56 rounded-full bg-primary/35 blur-xl opacity-70 transform-gpu will-change-[transform]"
          animate={prefersReducedMotion || !isInView ? undefined : { 
            y: [0, -110, 0], 
            x: [0, 65, 0], 
            scale: [1, 1.45, 1], 
            rotate: [0, 35, 0] 
          }}
          transition={prefersReducedMotion || !isInView ? undefined : { 
            duration: 11, 
            delay: 1.0, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-1/6 right-1/3 w-28 h-28 rounded-full bg-primary/45 blur-lg opacity-80 transform-gpu will-change-[transform]"
          animate={prefersReducedMotion || !isInView ? undefined : { 
            y: [0, 85, 0], 
            x: [0, -55, 0], 
            scale: [1, 1.55, 1], 
            rotate: [0, -30, 0] 
          }}
          transition={prefersReducedMotion || !isInView ? undefined : { 
            duration: 7.5, 
            delay: 0.2, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <Tag className="h-4 w-4 mr-2 text-primary" />
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
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full"
          >
            <PricingTable prices={prices ?? []} t={t} />
          </motion.div>
          
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-destructive bg-destructive/10 px-4 py-2 rounded-md border border-destructive/20">
                {error.message}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
