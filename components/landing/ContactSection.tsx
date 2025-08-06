"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-56 bg-gradient-to-b from-black to-muted"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl bg-gradient-to-r from-primary text-black bg-clip-text  dark:from-primary dark:text-white">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-zinc-500 dark:text-zinc-300 md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 2xl:gap-8">
          <Card className="overflow-hidden bg-background/80 dark:bg-background/80 border-0 shadow-lg backdrop-blur-md">
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
          <div className="flex flex-col justify-center space-y-8">
            <div className="grid gap-6 md:grid-cols-2 2xl:gap-8">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background 2xl:p-8">
                <MapPin className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />
                <div className="font-semibold text-foreground lg:text-lg 2xl:text-xl">{t("visitUs")}</div>
                <div className="text-sm text-muted-foreground 2xl:text-base">
                  {t("addressLine1")}<br />
                  {t("addressLine2")}<br />
                  {t("addressLine3")}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background 2xl:p-8">
                <Phone className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />
                <div className="font-semibold text-foreground lg:text-lg 2xl:text-xl">{t("callUs")}</div>
                <div className="text-sm text-muted-foreground 2xl:text-base">{t("phoneValue")}</div>
                <div className="text-xs text-muted-foreground 2xl:text-sm">{t("hours")}</div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background 2xl:p-8">
                <Mail className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />
                <div className="font-semibold text-foreground lg:text-lg 2xl:text-xl">{t("emailUs")}</div>
                <div className="text-sm text-muted-foreground 2xl:text-base">{t("emailValue")}</div>
                <div className="text-xs text-muted-foreground 2xl:text-sm">{t("emailNote")}</div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center shadow-sm bg-background 2xl:p-8">
                <span className="font-semibold text-foreground lg:text-lg 2xl:text-xl">{t("followUs")}</span>
                <div className="flex gap-2 justify-center mt-2 2xl:gap-3">
                  <Link href={t("facebookUrl")} aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors 2xl:h-12 2xl:w-12">
                    <Facebook className="h-5 w-5 text-muted-foreground 2xl:h-6 2xl:w-6" />
                  </Link>
                  <Link href={t("instagramUrl")} aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors 2xl:h-12 2xl:w-12">
                    <Instagram className="h-5 w-5 text-muted-foreground 2xl:h-6 2xl:w-6" />
                  </Link>
                  <Link href={t("twitterUrl")} aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors 2xl:h-12 2xl:w-12">
                    <Twitter className="h-5 w-5 text-muted-foreground 2xl:h-6 2xl:w-6" />
                  </Link>
                  <Link href={t("linkedinUrl")} aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-accent-foreground/10 transition-colors 2xl:h-12 2xl:w-12">
                    <Linkedin className="h-5 w-5 text-muted-foreground 2xl:h-6 2xl:w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}