"use client";

import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ModeToggle } from "./ui/modetoggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header");

  const languages = [
    { code: "en", name: "English" },
    { code: "it", name: "Italiano" },
    { code: "es", name: "Español" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Change language and preserve current route
  const changeLanguage = (newLang: string) => {
    router.replace(pathname, { locale: newLang });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            ParkEasy
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === `/${locale}`
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("home")}
          </Link>
          <Link
            href="/reservations"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === `/${locale}/reservations`
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("reservations")}
          </Link>
          <Link
            href="/manage"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === `/${locale}/manage`
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("manage")}
          </Link>
          <Link
            href="/admin/login"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith(`/${locale}/admin`)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("admin")}
          </Link>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t("language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={language.code === locale ? "bg-muted" : ""}
                >
                  {language.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t("language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={language.code === locale ? "bg-muted" : ""}
                >
                  {language.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`absolute top-16 left-0 right-0 bg-background border-b md:hidden transition-all duration-300 ease-in-out overflow-hidden z-40
            ${isMenuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <nav className="container flex flex-col py-4">
            <Link
              href="/"
              className="py-2 text-sm font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/reservations"
              className="py-2 text-sm font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              {t("reservations")}
            </Link>
            <Link
              href="/manage"
              className="py-2 text-sm font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              {t("manage")}
            </Link>
            <Link
              href="/admin/login"
              className="py-2 text-sm font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              {t("admin")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
