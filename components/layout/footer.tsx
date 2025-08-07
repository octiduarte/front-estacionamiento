"use client"
import { useTranslations } from "next-intl";
import { getCurrentItalyTime } from "@/lib/italy-time";
import { Heart, Car, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gradient-to-b from-black/90 to-black backdrop-blur-md border-t border-primary/10 py-6 md:py-0">
      <div className="container flex justify-center items-center gap-4 md:h-16 md:flex-row">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-center">
            &copy; {getCurrentItalyTime().getFullYear()} Green Parking. {t("rights")}.
          </p>
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Heart className="h-4 w-4 text-primary fill-primary" />
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
