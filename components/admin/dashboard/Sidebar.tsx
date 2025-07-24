"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Calendar, Settings, Car, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Admin.sidebar");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
    }
  };

  const navigation = [
    {
      name: t("reservations"),
      href: "/admin/dashboard/reservations",
      icon: Calendar,
    },
    {
      name: t("vehicleConfig"),
      href: "/admin/dashboard/config",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Sidebar vertical para desktop */}
      <div className="hidden md:block w-64 bg-gradient-to-b from-muted via-black to-muted shadow-lg h-full">
        <div className="flex items-center px-6 py-4 border-b">
          <Car className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl">{t("title")}</span>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-primary/5 text-primary border-r-2 border-primary"
                    : "hover:bg-muted hover:text-white text-muted-foreground/50"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm text-left text-destructive hover:bg-muted transition-colors mt-8"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
      {/* Sidebar inferior para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-muted via-black to-muted shadow-lg flex md:hidden">
        {navigation.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-muted hover:text-white text-muted-foreground/50"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 text-xs text-destructive hover:bg-muted transition-colors"
        >
          <LogOut className="h-5 w-5 mb-1" />
          Logout
        </button>
      </nav>
    </>
  );
}
