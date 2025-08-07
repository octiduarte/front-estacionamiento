"use client";

import { Car, Clock, CreditCard, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const t = useTranslations("AboutSection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-black/95 to-black/90 w-full py-12 md:py-24 lg:py-32 2xl:py-56 relative overflow-hidden"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-70"></div>
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
          
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 2xl:gap-16 mt-8">
            <motion.div 
              className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 lg:h-18 lg:w-18 2xl:h-20 2xl:w-20 shadow-md shadow-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Clock className="h-8 w-8 text-primary lg:h-9 lg:w-9 2xl:h-10 2xl:w-10" />
              </motion.div>
              <h3 className="text-xl font-bold lg:text-xl 2xl:text-2xl">{t("access247")}</h3>
              <p className="text-muted-foreground text-center">
                {t("access247Desc")}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 lg:h-18 lg:w-18 2xl:h-20 2xl:w-20 shadow-md shadow-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Car className="h-8 w-8 text-primary lg:h-9 lg:w-9 2xl:h-10 2xl:w-10" />
              </motion.div>
              <h3 className="text-xl font-bold lg:text-xl 2xl:text-2xl">{t("allVehicles")}</h3>
              <p className="text-muted-foreground text-center">
                {t("allVehiclesDesc")}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 lg:h-18 lg:w-18 2xl:h-20 2xl:w-20 shadow-md shadow-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <CreditCard className="h-8 w-8 text-primary lg:h-9 lg:w-9 2xl:h-10 2xl:w-10" />
              </motion.div>
              <h3 className="text-xl font-bold lg:text-xl 2xl:text-2xl">{t("securePayment")}</h3>
              <p className="text-muted-foreground text-center">
                {t("securePaymentDesc")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
