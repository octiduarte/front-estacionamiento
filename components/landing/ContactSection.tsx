"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const contactCards = [
    {
      icon: <MapPin className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: t("visitUs"),
      content: (
        <>
          {t("addressLine1")}<br />
          {t("addressLine2")}<br />
          {t("addressLine3")}
        </>
      )
    },
    {
      icon: <Phone className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: t("callUs"),
      content: (
        <>
          <div>{t("phoneValue")}</div>
          <div className="text-xs text-muted-foreground 2xl:text-sm">{t("hours")}</div>
        </>
      )
    },
    {
      icon: <Mail className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: t("emailUs"),
      content: (
        <>
          <div>{t("emailValue")}</div>
          <div className="text-xs text-muted-foreground 2xl:text-sm">{t("emailNote")}</div>
        </>
      )
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5 text-primary group-hover:text-white 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: t("facebookUrl"), label: "Facebook" },
    { icon: <Instagram className="h-5 w-5 text-primary group-hover:text-white 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: t("instagramUrl"), label: "Instagram" },
    { icon: <Twitter className="h-5 w-5 text-primary group-hover:text-white 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: t("twitterUrl"), label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5 text-primary group-hover:text-white 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: t("linkedinUrl"), label: "LinkedIn" }
  ];

  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-56 bg-gradient-to-b from-black/95 to-black/90 relative overflow-hidden"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50"
          animate={prefersReducedMotion ? undefined : { y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full border-2 border-primary/50 opacity-70"
          animate={prefersReducedMotion ? undefined : { y: [0, 70, 0], x: [0, -45, 0], scale: [1, 1.13, 1], rotate: [0, 10, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 9, delay: 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50"
          animate={prefersReducedMotion ? undefined : { y: [0, -60, 0], x: [0, 40, 0], scale: [1, 1.18, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-3/4 left-3/3 w-72 h-72 rounded-full border-2 border-primary/70"
          animate={prefersReducedMotion ? undefined : { y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.10, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 10, delay: 0.7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
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
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{t("title")}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl text-white drop-shadow-sm">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 2xl:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-black/40 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full">
              <CardContent className="p-0">
                <iframe
                  src={t("mapUrl")}
                  width="100%"
                  height="100%"
                  className="aspect-video lg:aspect-square w-full border-0 2xl:min-h-[500px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("mapTitle", { defaultValue: "Our Location" })}
                  aria-label={t("mapAriaLabel", { defaultValue: "Map showing our office location" })}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="grid gap-6 md:grid-cols-2 2xl:gap-8">
              {contactCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 bg-black/40 backdrop-blur-md transition-all duration-300 2xl:p-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {card.icon}
                  </motion.div>
                  <div className="font-semibold text-white lg:text-lg 2xl:text-xl">{card.title}</div>
                  <div className="text-sm text-muted-foreground 2xl:text-base">
                    {card.content}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 bg-black/40 backdrop-blur-md transition-all duration-300 2xl:p-8"
              >
                <span className="font-semibold text-white lg:text-lg 2xl:text-xl">{t("followUs")}</span>
                <div className="flex gap-2 justify-center mt-2 2xl:gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={social.url}
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-primary/30 hover:bg-primary/20 hover:border-primary transition-all duration-300 group "
                      >
                        {social.icon}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}