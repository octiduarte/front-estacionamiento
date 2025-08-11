"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe, Car, Settings2 , CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current route is in admin section (client-side only)
  useEffect(() => {
    setIsAdminRoute(pathname.includes('/admin'));
  }, [pathname]);

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
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300
        md:backdrop-blur-md
        ${scrolled ? "md:bg-black/90 shadow-lg shadow-primary" : "md:bg-black"}
        bg-black
      `}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/">
            <img src="/logo/LogoHeader.png" alt="Logo" className="h-8 w-auto drop-shadow-md hover:drop-shadow-lg transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <motion.div className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}>
            <div>
              <Link
                href="/"
                className={`text-sm  relative overflow-hidden group pb-2 ${pathname === "/" ? "text-primary" : "text-gray-200"
                  }`}
              >
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-primary group-hover:text-primary" />
                  {t("home")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div>
              <Link
                href="/reservations/create"
                className={`text-sm relative overflow-hidden group pb-2 ${pathname.includes("/reservations/create")
                  ? "text-primary"
                  : "text-gray-200"
                  }`}
              >
                <span className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4 text-primary group-hover:text-primary" />
                  {t("reservations")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div>
              <Link
                href="/reservations/manage"
                className={`text-sm  relative overflow-hidden group pb-2 ${pathname === "/reservations/manage"
                  ? "text-primary"
                  : "text-gray-200"
                  }`}
              >
                <span className="flex items-center gap-1">
                  <Settings2 className="h-4 w-4 text-primary group-hover:text-primary" />
                  {t("manage")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </motion.div>
          {!isAdminRoute && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="parking" size="icon" className="bg-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300">
                    <Globe className="h-5 w-5 text-primary hover:text-white transition-colors duration-300" />
                    <span className="sr-only">{t("language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/20">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`${language.code === locale ? "bg-primary text-white" : "hover:bg-primary/20"} transition-colors duration-200`}
                    >
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {!isAdminRoute && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="parking" size="icon" className="bg-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300">
                    <Globe className="h-5 w-5 text-primary hover:text-white transition-colors duration-300" />
                    <span className="sr-only">{t("language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/20">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`${language.code === locale ? "bg-primary text-white" : "hover:bg-primary/20"} transition-colors duration-200`}
                    >
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="bg-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary hover:text-white transition-colors duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-primary hover:text-white transition-colors duration-300" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{
            x: isMenuOpen ? 0 : "100%",
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-md border-l border-primary/20 shadow-2xl md:hidden z-40 overflow-hidden`}
        >
          <nav className="flex flex-col py-8 px-6 h-full">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="self-end mb-8 text-primary hover:text-white transition-colors"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
            >
              <X className="h-7 w-7" />
            </motion.button>

            <div className="space-y-6 mt-4">
              <div>
                <Link
                  href="/"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname === "/" ? "text-primary" : "text-gray-300"
                    }`}
                  onClick={toggleMenu}
                >
                  <Car className="h-5 w-5 text-primary group-hover:text-primary" />
                  {t("home")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div>
                <Link
                  href="/reservations/create"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname.includes("/reservations/create")
                    ? "text-primary"
                    : "text-gray-300"
                    }`}
                  onClick={toggleMenu}
                >
                  <CalendarClock className="h-5 w-5 text-primary group-hover:text-primary" />
                  {t("reservations")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div>
                <Link
                  href="/reservations/manage"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname === "/reservations/manage"
                    ? "text-primary"
                    : "text-gray-300"
                    }`}
                  onClick={toggleMenu}
                >
                  <Settings2 className="h-5 w-5 text-primary group-hover:text-primary" />
                  {t("manage")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
