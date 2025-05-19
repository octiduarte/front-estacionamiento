"use client";

import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50 dark:bg-background transition-colors">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary text-black bg-clip-text text-transparent dark:from-primary dark:to-blue-400">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-zinc-500 dark:text-zinc-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          <Card className="overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-0 shadow-lg backdrop-blur-md">
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
              <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center shadow-sm bg-white dark:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <MapPin className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("visitUs")}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  {t("addressLine1")}<br />
                  {t("addressLine2")}<br />
                  {t("addressLine3")}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center shadow-sm bg-white dark:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <Phone className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("callUs")}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  <Link href={`tel:${t("phoneValue")}`} className="hover:underline">
                    {t("phoneValue")}
                  </Link>
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">{t("hours")}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center shadow-sm bg-white dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Mail className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("emailUs")}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">
                <Link href={`mailto:${t("emailValue")}`} className="hover:underline">
                  {t("emailValue")}
                </Link>
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">{t("emailNote")}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("followUs")}</h3>
              <div className="flex space-x-4">
                <Link
                  href={t("facebookUrl")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Link>
                <Link
                  href={t("instagramUrl")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Link>
                <Link
                  href={t("twitterUrl")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Link>
                <Link
                  href={t("linkedinUrl")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}