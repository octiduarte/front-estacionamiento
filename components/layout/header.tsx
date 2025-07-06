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
    <header className="bg-gradient-to-b from-black to-muted text-white sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/logo/LogoHeader.png" alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors hover:text-primary ${pathname === "/"
                ? "text-primary"
                : "text-gray-200"
              }`}
          >
            {t("home")}
          </Link>
          <Link
            href="/reservations/create"
            className={`text-sm transition-colors hover:text-primary ${pathname === "/reservations/create"
                ? "text-primary"
                : "text-gray-200"
              }`}
          >
            {t("reservations")}
          </Link>
          <Link
            href="/reservations/manage"
            className={`text-sm transition-colors hover:text-primary ${pathname === "/reservations/manage"
                ? "text-primary"
                : "text-gray-200"
              }`}
          >
            {t("manage")}
          </Link>
          <Link
            href="/admin/login"
            className={`text-sm transition-colors hover:text-primary ${pathname === "/admin/login"
                ? "text-primary"
                : "text-gray-200"
              }`}
          >
            {t("admin")}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="parking" size="icon">
                <Globe className="h-5 w-5 text-primary hover:text-primary" />
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
              <X className="h-6 w-6 text-white hover:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-white hover:text-gray-300" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-muted to-black border-l shadow-2xl md:hidden transition-all duration-300 ease-in-out z-40
            ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
        >
          <nav className="flex flex-col py-8 px-6 h-full">
            <button
              className="self-end mb-8 text-gray-400 hover:text-primary transition-colors"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
            >
              <X className="h-7 w-7" />
            </button>
            <Link
              href="/"
              className={`py-2 text-lg font-medium hover:text-primary ${pathname === "/"
                  ? "text-primary"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/reservations/create"
              className={`py-2 text-lg font-medium hover:text-primary ${pathname === "/reservations/create"
                  ? "text-primary"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("reservations")}
            </Link>
            <Link
              href="/reservations/manage"
              className={`py-2 text-lg font-medium hover:text-primary ${pathname === "/reservations/manage"
                  ? "text-primary"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("manage")}
            </Link>
            <Link
              href="/admin/login"
              className={`py-2 text-lg font-medium hover:text-primary ${pathname === "/admin/login"
                  ? "text-primary"
                  : "text-gray-300"
                }`}
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
