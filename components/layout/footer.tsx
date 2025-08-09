"use client"
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
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
          className="flex flex-col items-center "
        >
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-center">
            &copy; 2025 Green Parking. {t("rights")}.
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground/80 transition-colors"
          >
            <span>Created with</span>
            <motion.div 
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart className="h-3 w-3 text-primary/70 fill-primary/70" />
            </motion.div>
            <span>by <strong>GO DEVS</strong></span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
