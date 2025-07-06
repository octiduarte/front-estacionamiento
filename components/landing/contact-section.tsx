"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  return (
    <motion.section
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-muted"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary text-black bg-clip-text  dark:from-primary dark:text-white">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-zinc-500 dark:text-zinc-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          <Card className="overflow-hidden bg-background/80 dark:bg-background/80 border-0 shadow-lg backdrop-blur-md">
            <CardContent className="p-0">
              <iframe
                src={t("mapUrl")}
                width="100%"
                height="100%"
                className="aspect-video lg:aspect-square w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("mapTitle", { defaultValue: "Our Location" })}
                aria-label={t("mapAriaLabel", { defaultValue: "Map showing our office location" })}
              />
            </CardContent>
          </Card>
          <div className="flex flex-col justify-center space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background">
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">{t("visitUs")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("addressLine1")}<br />
                  {t("addressLine2")}<br />
                  {t("addressLine3")}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background">
                <Phone className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">{t("callUs")}</div>
                <div className="text-sm text-muted-foreground">{t("phoneValue")}</div>
                <div className="text-xs text-muted-foreground">{t("hours")}</div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background">
                <Mail className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">{t("emailUs")}</div>
                <div className="text-sm text-muted-foreground">{t("emailValue")}</div>
                <div className="text-xs text-muted-foreground">{t("emailNote")}</div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background">
                <span className="font-semibold text-foreground">{t("followUs")}</span>
                <div className="flex gap-2 justify-center mt-2">
                  <Link href={t("facebookUrl")} aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors">
                    <Facebook className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link href={t("instagramUrl")} aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors">
                    <Instagram className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link href={t("twitterUrl")} aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link href={t("linkedinUrl")} aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}