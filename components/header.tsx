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
    <header className="bg-primary text-white sticky top-0 z-50 w-full border-b border-gray-700">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl hover:text-gray-300">
            ParkEasy
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors hover:text-white ${pathname === "/"
                ? "text-white"
                : "text-gray-300"
              }`}
          >
            {t("home")}
          </Link>
          <Link
            href="/reservations/create"
            className={`text-sm transition-colors hover:text-white ${pathname === "/reservations/create"
                ? "text-white"
                : "text-gray-300"
              }`}
          >
            {t("reservations")}
          </Link>
          <Link
            href="/reservations/manage"
            className={`text-sm transition-colors hover:text-white ${pathname === "/reservations/manage"
                ? "text-white"
                : "text-gray-300"
              }`}
          >
            {t("manage")}
          </Link>
          <Link
            href="/admin/login"
            className={`text-sm transition-colors hover:text-white ${pathname === "/admin/login"
                ? "text-white"
                : "text-gray-300"
              }`}
          >
            {t("admin")}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="icon">
                <Globe className="h-5 w-5 text-gray-300 hover:text-white" />
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
              <Button variant="default" size="icon">
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
          <Button variant="default" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white hover:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-white hover:text-gray-300" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`absolute top-16 left-0 right-0 bg-black border-b border-gray-700 md:hidden transition-all duration-300 ease-in-out overflow-hidden z-40
            ${isMenuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <nav className="container flex flex-col py-4">
            <Link
              href="/"
              className={`py-2 text-sm font-medium hover:text-white ${pathname === "/"
                  ? "text-white"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/reservations/create"
              className={`py-2 text-sm font-medium hover:text-white ${pathname === "/reservations/create"
                  ? "text-white"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("reservations")}
            </Link>
            <Link
              href="/reservations/manage"
              className={`py-2 text-sm font-medium hover:text-white ${pathname === "/reservations/manage"
                  ? "text-white"
                  : "text-gray-300"
                }`}
              onClick={toggleMenu}
            >
              {t("manage")}
            </Link>
            <Link
              href="/admin/login"
              className={`py-2 text-sm font-medium hover:text-white ${pathname === "/admin/login"
                  ? "text-white"
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
